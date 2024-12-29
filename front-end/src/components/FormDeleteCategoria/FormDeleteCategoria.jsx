import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";

import "./FormDeleteCategoria.css"

const FormDeleteCategoria = ({openOptions, handleCloseBackdropButton, handleDeleteCategoria}) => {
  return (
    <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
        open={openOptions}
        onClick={handleCloseBackdropButton}
    >
        <div onClick={(e) => e.stopPropagation()}
            className="form-buttons">
            <Button onClick={() => handleDeleteCategoria(categoriaID)}>
                SIM
            </Button>
            <Button onClick={handleCloseBackdropButton}>
                NÃO
            </Button>
        </div>
    </Backdrop>
  )
}

export default FormDeleteCategoria
