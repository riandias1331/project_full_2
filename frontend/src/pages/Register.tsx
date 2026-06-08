import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'erro ao registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>nb.</div>
          <h1 className={styles.title}>criar conta</h1>
          <p className={styles.sub}>comece agora, é grátis</p>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>nome</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Seu Nome" required autoFocus />
          </div>
          <div className={styles.field}>
            <label>email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <div className={styles.field}>
            <label>senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="mínimo 6 caracteres" minLength={6} required />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'criando...' : 'criar conta →'}
          </button>
        </form>
        <p className={styles.switch}>já tem conta? <Link to="/login">entrar</Link></p>
      </div>
    </div>
  )
}
