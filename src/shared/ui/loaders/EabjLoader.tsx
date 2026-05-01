import "./loaders.css";

export function EabjLoader() {
  return (
    <div className="loader">
      <svg height="0" width="0" viewBox="0 0 100 100" className="absolute">
        <defs xmlns="http://www.w3.org/2000/svg">
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="2"
            x2="0"
            y1="62"
            x1="0"
            id="eabjGradientPrimary"
          >
            <stop stopColor="#0369a1" />
            <stop stopColor="#67e8f9" offset="1.5" />
          </linearGradient>

          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="0"
            x2="0"
            y1="64"
            x1="0"
            id="eabjGradientAnimated"
          >
            <stop stopColor="#0369a1" />
            <stop stopColor="#22d3ee" offset="1" />
            <animateTransform
              repeatCount="indefinite"
              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
              keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
              dur="8s"
              values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
              type="rotate"
              attributeName="gradientTransform"
            />
          </linearGradient>

          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="2"
            x2="0"
            y1="62"
            x1="0"
            id="eabjGradientSecondary"
          >
            <stop stopColor="#38bdf8" />
            <stop stopColor="#075985" offset="1.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* E */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        className="inline-block"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="8"
          stroke="url(#eabjGradientPrimary)"
          d="M 80,20 L 20,20 L 20,50 L 68,50 L 20,50 L 20,80 L 80,80"
          className="dash"
          pathLength="360"
        />
      </svg>

      {/* A */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        className="inline-block"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="8"
          stroke="url(#eabjGradientSecondary)"
          d="M 20,85 L 50,15 L 80,85 M 32,58 L 68,58"
          className="dash"
          pathLength="360"
        />
      </svg>

      {/* B */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        className="inline-block"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="8"
          stroke="url(#eabjGradientAnimated)"
          d="M 25,15 L 25,85 L 60,85 
             C 82,85 82,55 60,55 
             L 25,55 
             L 60,55 
             C 82,55 82,15 60,15 
             Z"
          className="dash"
          pathLength="360"
        />
      </svg>

      {/* J */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        className="inline-block"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="8"
          stroke="url(#eabjGradientPrimary)"
          d="M 30,20 L 80,20 M 55,20 L 55,65 
             C 55,82 42,88 30,78"
          className="dash"
          pathLength="360"
        />
      </svg>
    </div>
  );
}