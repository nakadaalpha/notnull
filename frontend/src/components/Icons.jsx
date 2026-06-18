import React from "react";

export const EngineIcon = ({
	size = 16,
	className = "",
	strokeWidth = 1.5,
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		{/* Bagian atas (Air Filter / Intake) */}
		<line x1="9" y1="5" x2="17" y2="5" />
		<path d="M11 5v4" />
		<path d="M15 5v4" />

		{/* Bagian kiri (Kipas / Pulley) */}
		<line x1="5" y1="10" x2="5" y2="16" />
		<line x1="5" y1="13" x2="8" y2="13" />

		{/* Blok mesin utama dengan bagian kanan berbentuk persegi */}
		<path d="M8 9H18V11H22V17H18V19H11L8 16V9Z" />
		<line x1="18" y1="11" x2="18" y2="17" />
	</svg>
);

export const EvIcon = ({ size = 14, className = "", strokeWidth = 1.5 }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<circle cx="12" cy="12" r="10" />
		<path d="M9 7v4a3 3 0 0 0 6 0V7" />
		<path d="M12 14v4" />
		<path d="M10 7V4" />
		<path d="M14 7V4" />
		<path
			d="M12.5 9l-2 2.5h2L11.5 14l2-2.5h-2z"
			fill="currentColor"
			stroke="none"
		/>
	</svg>
);
