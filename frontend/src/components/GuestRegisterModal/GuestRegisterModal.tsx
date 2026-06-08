import React from 'react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';

const GUEST_LIMIT = 5;

const GuestRegisterModal: React.FC = () => {
  const history = useHistory();
  const { userId, guestReviews } = useUserStore();

  if (userId || guestReviews < GUEST_LIMIT) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, type: 'spring' }}
        style={{
          background: 'var(--c-bg)',
          borderRadius: 24,
          padding: '32px 28px',
          maxWidth: 380,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
        <h2 style={{
          fontFamily: 'var(--font-family)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--c-text)',
          margin: '0 0 10px',
        }}>
          Guarda tu progreso
        </h2>
        <p style={{
          fontFamily: 'var(--font-family)',
          fontSize: 15,
          color: 'var(--c-text-secondary)',
          margin: '0 0 28px',
          lineHeight: 1.5,
        }}>
          Has completado {GUEST_LIMIT} ejercicios. Crea una cuenta gratuita para guardar tu avance y seguir aprendiendo.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => history.push('/auth/register')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              border: 'none',
              background: 'var(--c-blue)',
              color: '#fff',
              fontFamily: 'var(--font-family)',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Crear cuenta gratis
          </button>
          <button
            onClick={() => history.push('/auth/login')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              border: '1.5px solid var(--c-separator)',
              background: 'none',
              color: 'var(--c-text)',
              fontFamily: 'var(--font-family)',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Ya tengo cuenta
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GuestRegisterModal;
