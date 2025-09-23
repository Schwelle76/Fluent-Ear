import styles from './LoadingIcon.module.css';

const LoadingIcon = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingIcon;
