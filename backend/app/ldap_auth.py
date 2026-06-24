from ldap3 import Server, Connection, ALL, NTLM, SUBTREE
from ldap3.core.exceptions import LDAPBindError, LDAPException
from .config import settings


def _extract_ous(member_dns: list[str]) -> list[str]:
    ous: list[str] = []
    for dn in member_dns:
        parts = [part.strip() for part in dn.split(",")]
        for part in parts:
            if part.upper().startswith("OU="):
                ou = part.split("=", 1)[1]
                if ou and ou not in ous:
                    ous.append(ou)
    return ous


def _ldap_bind_error_text(error: LDAPBindError) -> str:
    parts: list[str] = [str(error)]
    for arg in getattr(error, "args", []):
        if isinstance(arg, dict):
            message = arg.get("message")
            description = arg.get("description")
            if message:
                parts.append(str(message))
            if description:
                parts.append(str(description))
        elif arg:
            parts.append(str(arg))
    return " | ".join(part for part in parts if part)


def _map_ad_bind_error(error_msg: str) -> str:
    error_msg_lower = error_msg.lower()
    if "data 530" in error_msg_lower:
        return "No tiene permitido el acceso en este horario"
    if "data 533" in error_msg_lower:
        return "La cuenta está deshabilitada"
    if "data 775" in error_msg_lower:
        return "La cuenta está bloqueada"
    if "data 532" in error_msg_lower:
        return "La contraseña ha expirado"
    if "data 701" in error_msg_lower:
        return "La cuenta ha expirado"
    return "Usuario o contraseña incorrectos"

def authenticate_ad_user(username: str, password: str) -> dict | None:
    server = Server(settings.LDAP_SERVER, get_info=ALL)
    user_dn = f"{username}@{settings.LDAP_DOMAIN}"
    try:
        conn = Connection(
            server,
            user=user_dn,
            password=password,
            auto_bind=False,
            raise_exceptions=False,
        )
        if not conn.bind():
            result = conn.result or {}
            error_parts = [
                str(result.get("description", "")),
                str(result.get("message", "")),
                str(result.get("diagnosticMessage", "")),
            ]
            error_msg = " | ".join(part for part in error_parts if part and part != "None")
            print(f"LDAP BIND ERROR: {error_msg}")
            conn.unbind()
            raise ValueError(_map_ad_bind_error(error_msg))
    except LDAPBindError as e:
        error_msg = _ldap_bind_error_text(e)
        print(f"LDAP BIND ERROR: {error_msg}")
        raise ValueError(_map_ad_bind_error(error_msg))
    except LDAPException as e:
        print(f"LDAP ERROR: {e}")
        raise ValueError("Error de conexión con el servidor LDAP")
    conn.search(
        search_base=settings.LDAP_SEARCH_BASE,
        search_filter=f"(sAMAccountName={username})",
        search_scope=SUBTREE,
        attributes=["cn", "mail", "memberOf", "displayName"],
    )
    if not conn.entries:
        conn.unbind()
        return None
    entry = conn.entries[0]
    group_dns = [str(g) for g in entry.memberOf] if entry.memberOf else []
    ous = _extract_ous(group_dns)
    user_data = {
        "username": username,
        "display_name": str(entry.displayName) if entry.displayName else username,
        "email": str(entry.mail) if entry.mail else None,
        "role": ous[0] if ous else "user",
        "ou": ous,
    }
    conn.unbind()
    return user_data