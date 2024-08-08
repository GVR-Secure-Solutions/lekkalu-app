import { router, useRootNavigationState } from 'expo-router'
import React, { useEffect } from 'react'

const NotFoundRoute = () => {
  const rootNavigationState = useRootNavigationState()
  useEffect(() => {
    if (rootNavigationState?.key) {
      router.replace('/')
    }
  }, [rootNavigationState])
  return <></>
}

export default NotFoundRoute
