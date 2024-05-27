import React, { InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  errorMessage?: string | null;
}

const Input: React.FC<InputProps> = ({ label, errorMessage, icon, onChange, ...props }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event);
  };

  return (
    <div className={`${styles.appInputContainer} ${props.type || ""}`}>
      {label && <label>{label}</label>}
      <div className={styles.inputBar}>
        {icon && icon}
        <input {...props} onChange={handleInputChange} className={errorMessage ? styles.error : ""} />
      </div>
      {props.type === "checkbox" ? (
        <label className={styles.checkboxLabel}>
          <span className={`${styles.checkmark} ${props.checked ? styles.visible : ""}`}>✔</span>
        </label>
      ) : null}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default Input;
