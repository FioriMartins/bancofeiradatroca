import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const PrivateRoute = ({ element, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        const tokenData = localStorage.getItem('token')
        let token

        if (!tokenData || tokenData === " " || tokenData === "{}") {
            localStorage.setItem('token', JSON.stringify({token:'', username:'LogIn necessario', status: 401}))
            token = ''
        } else {
            const parsedToken = JSON.parse(tokenData)
            token = parsedToken.token
        }
        
        if (token) {
            axios
                .get('http://localhost:3000/auth/protected', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setIsAuthenticated(true)
                    let usuarioParsed = {
                        ...JSON.parse(localStorage.getItem('token')),
                        status: 200
                    }

                    localStorage.setItem('token', JSON.stringify(usuarioParsed))
                })
                .catch(() => {
                    setIsAuthenticated(false)
                    localStorage.setItem('token', JSON.stringify({token: '', username: 'Necessario fazer LogIn', status: 401}))
                })
        } else {
            setIsAuthenticated(false)
            localStorage.setItem('token', JSON.stringify({token: '', username: 'Necessario fazer LogIn', status: 401}))
        }
    }, [])

    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    if (isAuthenticated === false) {
        return <Navigate to="/venda" />
    }

    return element
}

export default PrivateRoute
