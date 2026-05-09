'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import DonationDialog from './donation-dialog'

const DonateCtx = createContext({ open: () => {} })

export function useDonate() {
  return useContext(DonateCtx)
}

export default function DonateProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultCause, setDefaultCause] = useState('general')

  const open = useCallback((cause = 'general') => {
    setDefaultCause(typeof cause === 'string' ? cause : 'general')
    setIsOpen(true)
  }, [])

  return (
    <DonateCtx.Provider value={{ open }}>
      {children}
      <DonationDialog open={isOpen} onOpenChange={setIsOpen} defaultCause={defaultCause} />
    </DonateCtx.Provider>
  )
}
