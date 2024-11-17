import { React, useState, useEffect } from 'react'
import axios from 'axios'

import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'




export default function Home() {
  const [feedLoading, setFeedLoading] = useState()
  const [turmas, setTurmas] = useState([])

  const Feed = (props) => {
    const { loading = false } = props;
  
    return (
      <>
      <div className='feed-container'>
        {(loading ? Array.from(new Array(100)) : turmas).map((item, index) => (
          <div key={index}>
            {item ? (
              <div className='feed-item'>
                {item.id}<br/>
                {item.descricao}<br/>
                {item.comandaId}<br/>
              </div>
            ) : (
              <div className='feed-item'>
                <Skeleton width={35} />
                <Skeleton width={100} />
                <Skeleton width={55} />
              </div>
            )}
          </div>
        ))}
        </div>
      </>
    );
  }

  const fetchTurma = async () => {
    try {
      setFeedLoading(true)
      const responde = await axios.get('#')
      setTurmas(responde.data)

      if (responde.statusText == "OK") {
        setFeedLoading(false)
      }
    } catch (err) {
      console.log('Erro: ', err)
    }
  }

  useEffect(() => {
    fetchTurma()
  }, [])

  return (
    <>
        {feedLoading ? <Feed loading /> : <Feed />}
    </>
  )
}