import React from 'react'
import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

import LoginForm from '../components/LoginForm/LoginForm'
import { EIdentityProviderService } from '../services'
import { useVoterStore } from '../store'
import { delay } from '../util/helper'
import './LoginPage.css'
let injectedProvider = false

if (typeof window.ethereum !== 'undefined') {
  injectedProvider = true
  console.log(window.ethereum)
}

const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false

const LoginPage: React.FC = () => {
  const voterState = useVoterStore()
  const [loading, setLoading] = useState(false)
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      console.log(provider)
      setHasProvider(Boolean(provider)) // transform provider to true or false
    }

    getProvider()
  }, [])

  const handleLogin = async (username: string, password: string): Promise<void> => {
    try {
      setLoading(true)
      await delay(500)
      const token = await EIdentityProviderService.getToken(username, password)
      setLoading(false)
      voterState.setToken(token)
      voterState.setAuthenicated(true)
      voterState.setError(false)
      voterState.setMessage('')
    } catch (error) {
      console.log(error)
      setLoading(false)
      voterState.setError(true)
      voterState.setMessage('Login failed. Wrong username or password.')
      voterState.logout()
    }
  }

  // return <LoginForm onLogin={handleLogin} loading={loading} />
  return (
    <div className="App">
      <h2>Injected Provider { injectedProvider ? 'DOES' : 'DOES NOT'} Exist</h2>
      { isMetaMask && 
        <button>Connect MetaMask</button>
      }
    </div>
  )
}

export default LoginPage
