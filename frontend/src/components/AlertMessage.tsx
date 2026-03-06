import type { AlertState } from '../types/dashboard';

interface AlertMessageProps {
  alert: AlertState;
  onClose: () => void;
}

const AlertMessage = ({ alert, onClose }: AlertMessageProps): JSX.Element => (
  <div className={`alert-banner alert-banner-${alert.type}`} role="alert">
    <span>{alert.message}</span>
    <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
  </div>
);

export default AlertMessage;
