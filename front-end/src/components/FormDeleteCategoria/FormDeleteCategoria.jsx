import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";

import "./FormDeleteCategoria.css"

const FormDeleteCategoria = ({openOptions, handleCloseBackdropButton, handleDeleteCategoria, handleDeleteSubcategoria, categoriaID}) => {
  return (
    <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 10000 })}
        open={openOptions}
        onClick={handleCloseBackdropButton}
        invisible
    >
        <div
            onClick={(e) => e.stopPropagation()}
            style={{
                background: `#f9f9f9`,
                color: `black`,
                width: `20dvw`,
                borderRadius: `10px`,
                paddingLeft: `1.5rem`,
                paddingTop: `1px`,
                display: 'flex', 
                flexDirection: 'column'
            }}
        >
            <h1>Tem certeza disso?</h1>
            <p>Não poderá voltar atrás depois</p>
            <div className="form-buttons">
                <Button
                    onClick={() => handleDeleteCategoria ? handleDeleteCategoria(categoriaID) : handleDeleteSubcategoria(categoriaID)}
                    sx={{
                        color: 'black',
                        borderRadius: '0.5rem'
                    }}
                >
                    SIM
                </Button>
                <Button
                    onClick={handleCloseBackdropButton}
                    sx={{
                        color: 'black',
                        borderRadius: '0.5rem'
                    }}
                >
                    NÃO
                </Button>
            </div>
        </div>
    </Backdrop>
  )
}

export default FormDeleteCategoria
