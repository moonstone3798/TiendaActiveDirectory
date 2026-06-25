import { useState } from "react";
import ButtonComponent from "@/components/atoms/button/ButtonComponent";
import ProductEditDialog from "@/components/molecules/dialog/ProductEditDialog";
import ProductGrid from "@/components/molecules/grid/ProductGrid";
import { useSelector } from "react-redux";
import "@/components/router/home/Home.module.css";
const Home = () => {
  const [openDialogOpen, setOpenDialogOpen] = useState(false);
  const userRole = useSelector((state) => state.auth.user?.role);
  const handleOpenDialog = () => {
    setOpenDialogOpen(true);
  };
  return (
    <>
      {userRole === "Admin" && (
        <div className="flex justify-end pt-4 pe-6">
          <ButtonComponent
            text="Agregar producto"
            color="#FF8FAB"
            onClick={handleOpenDialog}
          />
        </div>
      )}

      <ProductEditDialog
        open={openDialogOpen}
        onClose={() => setOpenDialogOpen(false)}
      />
      <ProductGrid />
    </>
  );
};
export default Home;
