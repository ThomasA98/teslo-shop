import React, { useReducer } from 'react'
import { UiContext, UiState, uiReducer } from './'

interface UiProviderProps {
    children: React.ReactNode
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false
}

export const UiProvider: React.FC<UiProviderProps> = ({ children }) => {

    const [ state, dispatch ] = useReducer(uiReducer, UI_INITIAL_STATE);

    const toggleSideMenu = () => {
        dispatch({
            type: '[UI] - ToggleMenu'
        })
    }

  return (
    <UiContext.Provider value={{
        ...state,
        toggleSideMenu
    }} >
        { children }
    </UiContext.Provider>
  )
}
