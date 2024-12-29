import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const PrivateRoute = ({ element, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        
        if (token) {
            axios
                .get('http://localhost:3000/protected', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setIsAuthenticated(true)
                })
                .catch(() => {
                    setIsAuthenticated(false)
                })
        } else {
            setIsAuthenticated(false)
        }
    }, [])

    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    if (isAuthenticated === false) {
        return <Navigate to="/" />
    }

    return element
}

export default PrivateRoute
