import { React, useState, useEffect } from 'react'
import axios from 'axios'

import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import IconButton from '@mui/material/IconButton'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import InputAdornment from '@mui/material/InputAdornment'

const filter = createFilterOptions()

export default function Home() {
  const [categorias, setCategorias] = useState([])
  const [turmas, setTurmas] = useState([])
  const [value, setValue] = useState(null)
  const [valueTurma, setValueTurma] = useState(null)
  const [open, toggleOpen] = useState(false)

  const handleClose = () => {
    setDialogValue({
      nome: '',
      desc: '',
    })
    toggleOpen(false)
  }

  const [dialogValue, setDialogValue] = useState({
    nome: '',
    desc: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault()
    setValue({
      nome: dialogValue.nome,
      desc: dialogValue.desc,
    })
    try {
      const response = await fetch('http://192.168.56.1:3000/categorias/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dialogValue),
      })

      if (response.ok) {
        console.log(`ok`)
      } else {
        console.log(response)
      }
    } catch (e) {
      console.error(e)
      alert(e)
    }
    handleClose()
  }

  const fetchCategorias = async () => {
    try {
      const responde = await axios.get('#')
      setCategorias(responde.data)
      if (responde.statusText == "OK") {
        // console.log('OK')    
        // console.log(categorias)
      }
    } catch (err) {
      console.log('Erro: ', err)
    }
  }

  const fetchTurmas = async () => {
    try {
      const responde = await axios.get('#')
      setTurmas(responde.data)
      if (responde.statusText == "OK") {
        // console.log('ok')
      }
    } catch (err) {
      console.log('Erro: ', err)
    }
  }

  useEffect(() => {
    fetchCategorias()
    fetchTurmas()
  }, [])

  // useEffect(() => {
  //   console.log('Categorias atualizadas:', categorias);
  // }, [categorias])

  const adicionarAoCarrinho = (produto) => {
    // Passo 1: Pegar o carrinho atual (ou criar um novo array se não existir)
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []

    // Passo 2: Adicionar o novo produto ao array
    carrinho.push(produto)

    // Passo 3: Atualizar o localStorage com o novo array
    localStorage.setItem('carrinho', JSON.stringify(carrinho))

    console.log('Produto adicionado:', produto)
  }

  const handleSubmitCarrinho = () => {
    adicionarAoCarrinho(dados)
  }

  const [dados, setDados] = useState({
    nome: '',
    valor: '',
    desc: '',
    categoria: '',
    turma: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setDados({
      ...dados,
      [name]: value,
    })
    console.log(dados)
  }

  return (
    <>
      <div className='contentProduct'>
        <div>
          <form className='formularioProdutos' onSubmit={handleSubmitCarrinho} >
            <h2>Formulário de Cadastro de Produtos</h2>
            <p>Por favor preencha tudo safada</p>
            <TextField name='nome' onChange={handleChange} id="outlined-basic" label="Nome do produto" variant="outlined" sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#343c4c',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#343c4c',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#343c4c',
              },
              '& .Mui-focused label': {
                color: '#343c4c',
              },
            }} required />
            <TextField id="outlined-basic" name='valor' slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">ETC$</InputAdornment>,
              },
            }} onChange={handleChange} type='number' min='1' label="Valor do produto" variant="outlined" sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#343c4c',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#343c4c',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#343c4c',
              },
              '& .Mui-focused label': {
                color: '#343c4c',
              },
            }} required />


            <TextField id="outlined-basic" name='desc' onChange={handleChange} label="Descricao" variant="outlined" sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  fontFamily: 'Alata, Arial',
                  borderColor: '#343c4c',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#343c4c',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#343c4c',
              },
              '& .Mui-focused label': {
                color: '#343c4c',
              },
            }} />


            <Autocomplete
              value={value}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  // timeout to avoid instant validation of the dialog's form.
                  setTimeout(() => {
                    toggleOpen(true);
                    setDialogValue({
                      nome: newValue,
                      desc: '',
                    });
                  });
                } else if (newValue && newValue.inputValue) {
                  toggleOpen(true);
                  setDialogValue({
                    nome: newValue.inputValue,
                    desc: '',
                  });
                } else {
                  setValue(newValue);
                  setDados({
                    ...dados,
                    categoria: newValue.nome,
                  })
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== '') {
                  filtered.push({
                    inputValue: params.inputValue,
                    nome: `Adicionar "${params.inputValue}"?`,
                  });
                }

                return filtered;
              }}
              id="free-solo-dialog-demo"
              options={categorias}
              getOptionLabel={(option) => {
                // for example value selected with enter, right from the input
                if (typeof option === 'string') {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.nome;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    {option.nome}
                  </li>
                );
              }}
              sx={{
                width: 223,
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#343c4c',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#343c4c',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#343c4c',
                },
                '& .Mui-focused label': {
                  color: '#343c4c',
                },
              }}
              freeSolo
              renderInput={(params) => <TextField name='categoria' onChange={handleChange} {...params} label="Categoria" />}
              required
            />


            <Dialog open={open} onClose={handleClose}>
              <form onSubmit={handleSubmit}>
                <DialogTitle>Adicionar uma nova categoria</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Seja direto e claro!
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    value={dialogValue.nome}
                    onChange={(event) =>
                      setDialogValue({
                        ...dialogValue,
                        nome: event.target.value,
                      })
                    }
                    label="Nome"
                    type="text"
                    variant="standard"
                  />
                  <TextField
                    margin="dense"
                    id="name"
                    value={dialogValue.desc}
                    onChange={(event) =>
                      setDialogValue({
                        ...dialogValue,
                        desc: event.target.value,
                      })
                    }
                    label="Pequena descrição"
                    type="text"
                    variant="standard"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancelar</Button>
                  <Button type="submit">Adicionar</Button>
                </DialogActions>
              </form>
            </Dialog>

            <Autocomplete
              value={valueTurma}
              id="free-solo-dialog-demo"
              options={turmas}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.id;
              }}
              onChange={(event, newValue) => {
                setDados({
                  ...dados,
                  turma: newValue.id,
                })

              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    {option.id} - {option.patrono}
                  </li>
                );
              }}
              sx={{
                width: 223,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#343c4c',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#343c4c',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#343c4c',
                },
                '& .Mui-focused label': {
                  color: '#343c4c',
                },
              }}
              freeSolo
              renderInput={(params) => <TextField name='turma' onChange={handleChange} {...params} label="Turma" />}
              required
            />
            <Button type='submit' variant="contained" endIcon={<AddShoppingCartIcon />} sx={{ backgroundColor: '#343c4c', color: '#e8f7f2' }}>
              Adicionar
            </Button>
          </form>
        </div>
        <div className='carrinho'>
          <h2>Carrinho</h2>
          <Carrinho />
        </div>
      </div>
      <div>

      </div>
    </>
  );
}

function Comanda() {
  return
}

function Carrinho() {
  const [carrinho, setCarrinho] = useState([])

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem('carrinho')) || [];
    setCarrinho(carrinhoSalvo);
  }, [])
  return (
    <>
      {carrinho.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <div className='carrinhoProd'>
          {carrinho.map((produto, index) => (
            <div key={index} className='boxProduct'>
              <div className='carHeader'>
                <IconButton aria-label='delete' onClick={() => {
                  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []

                  // Remover o produto pelo índice
                  carrinho.splice(index, 1)

                  // Atualizar o localStorage
                  localStorage.setItem('carrinho', JSON.stringify(carrinho))

                  window.location.reload()
                  console.log('Produto removido. Carrinho atualizado:', carrinho)
                }}><DeleteForeverIcon sx={{ color: 'red' }} />
                </IconButton>
                <p>{produto.nome}</p>
              </div>
              <p>ETC$ {produto.valor}</p>
              <p>{produto.categoria}</p>
              <p>{produto.desc}</p>
              <p>{produto.turma}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}