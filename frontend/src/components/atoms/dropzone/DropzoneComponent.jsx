import { useEffect, useRef, useState } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import "./DropzoneComponent.css";

const DropzoneComponent = ({
  onFileChange,
  onInitialImageRemove,
  maxFiles = 1,
  acceptedFiles = "image/*",
  message = "Arrastra y suelta un archivo aqui o haz clic para seleccionar",
  className = "",
  initialImageUrl = null,
}) => {
  const dropzoneRef = useRef(null);
  const [showInitialImage, setShowInitialImage] = useState(!!initialImageUrl);

  useEffect(() => {
    if (!dropzoneRef.current) {
      return;
    }

    Dropzone.autoDiscover = false;
    const instance = new Dropzone(dropzoneRef.current, {
      url: "/",
      autoProcessQueue: false,
      clickable: true,
      maxFiles,
      acceptedFiles,
      addRemoveLinks: false,
      dictDefaultMessage: message,
      previewTemplate: `<div class="dz-preview dz-file dz-image-preview">
        <div class="dz-image"><img data-dz-thumbnail style="width: 100%; height: 100%; object-fit: contain;" /></div>
        <button type="button" class="dz-remove-preview" data-dz-remove>×</button>
      </div>`,
    });

    instance.on("addedfile", (file) => {
      if (maxFiles === 1 && instance.files.length > 1) {
        instance.removeFile(instance.files[0]);
      }
      setShowInitialImage(false);
      onFileChange?.(file);
    });

    instance.on("removedfile", () => {
      if (instance.files.length === 0) {
        onFileChange?.(null);
      }
    });

    instance.on("maxfilesexceeded", (file) => {
      if (maxFiles === 1) {
        instance.removeAllFiles(true);
        instance.addFile(file);
      }
    });

    return () => {
      instance.destroy();
    };
  }, [acceptedFiles, maxFiles, message, onFileChange]);

  const classes = [
    "dropzone",
    "dropzone-component",
    className,
    showInitialImage && "has-initial-image",
  ]
    .filter(Boolean)
    .join(" ");

  const handleRemoveInitialImage = (e) => {
    e.stopPropagation();
    setShowInitialImage(false);
    onFileChange?.(null);
    onInitialImageRemove?.();
  };

  return (
    <div className="dropzone-wrapper">
      <div ref={dropzoneRef} className={classes}>
        {showInitialImage && initialImageUrl && (
          <div className="dropzone-initial-image">
            <img src={initialImageUrl} alt="Imagen actual" />
            <button
              className="dropzone-remove-btn"
              onClick={handleRemoveInitialImage}
              title="Remover imagen"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropzoneComponent;
