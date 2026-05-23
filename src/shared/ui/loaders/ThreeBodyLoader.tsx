import "./loaders.css";

type ThreeBodyLoaderProps = {
  className?: string;
};

export function ThreeBodyLoader({ className = "" }: ThreeBodyLoaderProps) {
  return (
    <div
      className={`three-body ${className}`}
      role="status"
      aria-label="Cargando"
    >
      <div className="three-body__dot" />
      <div className="three-body__dot" />
      <div className="three-body__dot" />
    </div>
  );
}
