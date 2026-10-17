import React from 'react';

interface TimeUpPaymentModalProps {
  isOpen: boolean;
  onPay: () => void;
  onPlayAsGuest: () => void;
}

export const TimeUpPaymentModal: React.FC<TimeUpPaymentModalProps> = ({ isOpen, onPay, onPlayAsGuest }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'black',
      zIndex: 9999,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1 style={{color: 'white'}}>TIME'S UP ⏳</h1>
      <p style={{color: '#888'}}>Your time limit ended</p>
      <div style={{border: '1px solid #333', padding: '20px', borderRadius: '15px', marginTop: '20px', width: '90%', maxWidth: '300px'}}>
        <h2 style={{color: 'white'}}>Continue Playing?</h2>
        <p>Pay to unlock BLOXHUB</p>
        <button onClick={onPay} style={{background: 'white', color: 'black', padding: '15px', width: '100%', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer'}}>PAY TO CONTINUE</button>
        <button onClick={onPlayAsGuest} style={{background: 'transparent', color: '#555', border: '1px solid #333', padding: '10px', width: '100%', borderRadius: '10px', marginTop: '10px', cursor: 'pointer'}}>Play as Guest 666 (FREE & SAFE)</button>
      </div>
    </div>
  );
};
