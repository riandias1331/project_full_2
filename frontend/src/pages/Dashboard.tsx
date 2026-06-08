import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) ?? '??'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>nb.</div>
        <button className={styles.logoutBtn} onClick={handleLogout}>sair</button>
      </header>
      <main className={styles.main}>
        <div className={styles.welcome}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <h1 className={styles.name}>olá, {user?.name.split(' ')[0]} 👋</h1>
            <p className={styles.email}>{user?.email}</p>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>status</span>
            <span className={styles.metricValue} style={{color:'var(--success)'}}>● autenticado</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>role</span>
            <span className={styles.metricValue}>{user?.role}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>id</span>
            <span className={styles.metricValue} style={{fontSize:11,fontFamily:'var(--font-mono)'}}>{user?._id}</span>
          </div>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>rotas disponíveis</h2>
          <div className={styles.routeList}>
            {[
              {method:'POST', path:'/api/auth/register', desc:'criar conta'},
              {method:'POST', path:'/api/auth/login',    desc:'entrar'},
              {method:'GET',  path:'/api/auth/me',       desc:'perfil atual', auth:true},
              {method:'PUT',  path:'/api/users/profile', desc:'atualizar perfil', auth:true},
              {method:'GET',  path:'/api/users',         desc:'listar usuários', admin:true},
              {method:'DELETE',path:'/api/users/:id',    desc:'deletar usuário', admin:true},
            ].map((r,i) => (
              <div key={i} className={styles.routeRow}>
                <span className={`${styles.method} ${styles[r.method.toLowerCase() as keyof typeof styles]}`}>{r.method}</span>
                <code className={styles.path}>{r.path}</code>
                <span className={styles.desc}>{r.desc}</span>
                {r.auth  && <span className={styles.badge}>🔒 jwt</span>}
                {r.admin && <span className={styles.badgeAdmin}>👑 admin</span>}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
