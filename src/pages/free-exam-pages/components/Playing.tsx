
const Playing = () => {
    return (
         <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="24"
    viewBox="0 0 64 64"
    role="img"
    aria-label="Music wave animation"
  >
    <title>Music wave</title>

    <g fill="currentColor">
      <rect x="6" width="6" y="18" rx="1.5" height="28">
        <animate
          attributeName="height"
          dur="1s"
          repeatCount="indefinite"
          values="12;36;20;30;12"
          keyTimes="0;0.25;0.5;0.75;1"
        />
        <animate
          attributeName="y"
          dur="1s"
          repeatCount="indefinite"
          values="26;14;22;17;26"
          keyTimes="0;0.25;0.5;0.75;1"
        />
      </rect>

      <rect x="14" width="6" y="18" rx="1.5" height="28">
        <animate
          attributeName="height"
          dur="1s"
          repeatCount="indefinite"
          begin="0.12s"
          values="18;30;12;34;18"
          keyTimes="0;0.25;0.5;0.75;1"
        />
        <animate
          attributeName="y"
          dur="1s"
          repeatCount="indefinite"
          begin="0.12s"
          values="23;17;26;15;23"
          keyTimes="0;0.25;0.5;0.75;1"
        />
      </rect>

      <rect x="22" width="6" y="18" rx="1.5" height="28">
        <animate
          attributeName="height"
          dur="1s"
          repeatCount="indefinite"
          begin="0.24s"
          values="10;40;28;22;10"
          keyTimes="0;0.25;0.5;0.75;1"
        />
        <animate
          attributeName="y"
          dur="1s"
          repeatCount="indefinite"
          begin="0.24s"
          values="27;12;18;21;27"
          keyTimes="0;0.25;0.5;0.75;1"
        />
      </rect>

      <rect x="30" width="6" y="18" rx="1.5" height="28">
        <animate
          attributeName="height"
          dur="1s"
          repeatCount="indefinite"
          begin="0.06s"
          values="24;12;40;16;24"
          keyTimes="0;0.25;0.5;0.75;1"
        />
        <animate
          attributeName="y"
          dur="1s"
          repeatCount="indefinite"
          begin="0.06s"
          values="20;26;12;24;20"
          keyTimes="0;0.25;0.5;0.75;1"
        />
      </rect>

      <rect x="38" width="6" y="18" rx="1.5" height="28">
        <animate
          attributeName="height"
          dur="1s"
          repeatCount="indefinite"
          begin="0.18s"
          values="12;30;18;36;12"
          keyTimes="0;0.25;0.5;0.75;1"
        />
        <animate
          attributeName="y"
          dur="1s"
          repeatCount="indefinite"
          begin="0.18s"
          values="26;17;23;14;26"
          keyTimes="0;0.25;0.5;0.75;1"
        />
      </rect>

      <rect x="46" width="6" y="18" rx="1.5" height="28">
        <animate
          attributeName="height"
          dur="1s"
          repeatCount="indefinite"
          begin="0.30s"
          values="18;34;12;30;18"
          keyTimes="0;0.25;0.5;0.75;1"
        />
        <animate
          attributeName="y"
          dur="1s"
          repeatCount="indefinite"
          begin="0.30s"
          values="23;15;26;17;23"
          keyTimes="0;0.25;0.5;0.75;1"
        />
      </rect>

      <rect x="54" width="6" y="18" rx="1.5" height="28">
        <animate
          attributeName="height"
          dur="1s"
          repeatCount="indefinite"
          begin="0.36s"
          values="14;28;36;20;14"
          keyTimes="0;0.25;0.5;0.75;1"
        />
        <animate
          attributeName="y"
          dur="1s"
          repeatCount="indefinite"
          begin="0.36s"
          values="25;18;14;22;25"
          keyTimes="0;0.25;0.5;0.75;1"
        />
      </rect>
    </g>
  </svg>
    );
};

export default Playing;