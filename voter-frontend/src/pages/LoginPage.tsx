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
  const initialState = { accounts: [] }             
  const [wallet, setWallet] = useState(initialState)

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {                
        updateWallet(accounts)                  
      } else {                                  
        // if length 0, user is disconnected    
        setWallet(initialState)                 
      }                                         
    }   
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      console.log(provider)
      setHasProvider(Boolean(provider)) // transform provider to true or false

      if (provider) {                                         
        const accounts = await window.ethereum.request(       
          { method: 'eth_accounts' }                          
        )                                                     
        refreshAccounts(accounts)                             
        window.ethereum.on('accountsChanged', refreshAccounts)
      }   
    }

    getProvider()
    // return () => {                                        
      // window.ethereum?.removeListener('accountsChanged', refreshAccounts)
    // }
  }, [])

  const updateWallet = async (accounts:any) => {
    setWallet({ accounts })                     
  }                                             

  const handleConnect = async () => {             
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",              
    })                                            
    updateWallet(accounts)                        
  }   

  // const handleLogin = async (username: string, password: string): Promise<void> => {
  const handleLogin = () => {
    try {
      setLoading(true)
      // await delay(500)
      // const token = await EIdentityProviderService.getToken(username, password)
      setLoading(false)
      // voterState.setToken(token)
      voterState.setAuthenicated(true)
      voterState.setWallet(wallet.accounts[0])
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

      { wallet.accounts.length > 0 &&              
        <div>Wallet Accounts: { wallet.accounts[0] }</div>
      }
    <button onClick={handleLogin}>Continue</button>
    </div>
  )
}

export default LoginPage
