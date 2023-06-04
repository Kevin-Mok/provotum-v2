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
  const initialState = { accounts: [] }               /* New */
  const [wallet, setWallet] = useState(initialState)  /* New */

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {                /* New */
      if (accounts.length > 0) {                                /* New */
        updateWallet(accounts)                                  /* New */
      } else {                                                  /* New */
        // if length 0, user is disconnected                    /* New */
        setWallet(initialState)                                 /* New */
      }                                                         /* New */
    }   
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      console.log(provider)
      setHasProvider(Boolean(provider)) // transform provider to true or false

      if (provider) {                                           /* New */
        const accounts = await window.ethereum.request(         /* New */
          { method: 'eth_accounts' }                            /* New */
        )                                                       /* New */
        refreshAccounts(accounts)                               /* New */
        window.ethereum.on('accountsChanged', refreshAccounts)  /* New */
      }   
    }

    getProvider()
    // return () => {                                              /* New */
      // window.ethereum?.removeListener('accountsChanged', refreshAccounts)
    // }
  }, [])

  const updateWallet = async (accounts:any) => {     /* New */
    setWallet({ accounts })                          /* New */
  }                                                  /* New */

  const handleConnect = async () => {                /* New */
    let accounts = await window.ethereum.request({   /* New */
      method: "eth_requestAccounts",                 /* New */
    })                                               /* New */
    updateWallet(accounts)                           /* New */
  }   

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
      <h2>MetaMask { injectedProvider ? '' : 'Not'} Installed</h2>
      { window.ethereum.isMetaMask && wallet.accounts.length < 1 &&  /* Updated */
        <button onClick={handleConnect}>Connect MetaMask</button>
      }

      { wallet.accounts.length > 0 &&                /* New */
        <div>Wallet Accounts: { wallet.accounts[0] }</div>
      }
    </div>
  )
}

export default LoginPage
