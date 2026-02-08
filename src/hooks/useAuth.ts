import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session, User } from '@supabase/supabase-js'
import type { Usuario } from '@/types/property'

interface AuthState {
  session: Session | null
  user: User | null
  profile: Usuario | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: session ? true : false, // still loading if we need to fetch profile
      }))

      if (session?.user) {
        fetchProfile(session.user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: session ? true : false,
      }))

      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setState((prev) => ({ ...prev, profile: null, loading: false }))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('inmob_usuarios')
      .select('*')
      .eq('id', userId)
      .single()

    setState((prev) => ({
      ...prev,
      profile: data,
      loading: false,
    }))
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return {
    ...state,
    signIn,
    signOut,
    isAdmin: state.profile?.rol === 'admin',
    isEditor: state.profile?.rol === 'editor',
    isAuthenticated: !!state.session,
  }
}
