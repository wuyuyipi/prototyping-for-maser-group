import React from "react";

export interface AvatarDefinition {
  id: string;
  name: string;
  species: string;
  themeColor: string;
  renderSvg: (props?: { isMoving?: boolean; facingLeft?: boolean }) => React.ReactNode;
}

export const AVATAR_LIST: AvatarDefinition[] = [
  {
    id: "dino",
    name: "SPIKE",
    species: "Pixel Kaiju",
    themeColor: "#22c55e",
    renderSvg: () => (
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        shapeRendering="crispEdges"
      >
        {/* Dorsal Red Spikes */}
        <rect x="2" y="2" width="2" height="2" fill="#ef4444" />
        <rect x="2" y="5" width="2" height="2" fill="#ef4444" />
        <rect x="2" y="8" width="2" height="2" fill="#ef4444" />
        <rect x="1" y="10" width="2" height="2" fill="#ef4444" />

        {/* Dino Body Dark Outline */}
        <rect x="4" y="1" width="8" height="1" fill="#052e16" />
        <rect x="3" y="2" width="11" height="11" fill="#052e16" />
        <rect x="13" y="3" width="2" height="5" fill="#052e16" />
        {/* Tail outline */}
        <rect x="1" y="11" width="3" height="3" fill="#052e16" />
        {/* Legs outline */}
        <rect x="3" y="13" width="4" height="3" fill="#052e16" />
        <rect x="9" y="13" width="4" height="3" fill="#052e16" />

        {/* Body Green */}
        <rect x="4" y="2" width="9" height="10" fill="#22c55e" />
        <rect x="12" y="4" width="2" height="4" fill="#22c55e" />
        <rect x="2" y="11" width="2" height="2" fill="#22c55e" />
        {/* Back highlight */}
        <rect x="4" y="2" width="2" height="6" fill="#86efac" />
        {/* Feet */}
        <rect x="4" y="13" width="2" height="2" fill="#15803d" />
        <rect x="10" y="13" width="2" height="2" fill="#15803d" />

        {/* Eye */}
        <rect x="9" y="3" width="2" height="2" fill="#000000" />
        <rect x="9" y="3" width="1" height="1" fill="#ffffff" />

        {/* Mouth & Teeth */}
        <rect x="10" y="6" width="4" height="1" fill="#052e16" />
        <rect x="11" y="7" width="1" height="1" fill="#ffffff" />
        <rect x="13" y="7" width="1" height="1" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "cyclops",
    name: "GLOOP",
    species: "Cyan Cyclops",
    themeColor: "#06b6d4",
    renderSvg: () => (
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        shapeRendering="crispEdges"
      >
        {/* Outline */}
        <rect x="5" y="1" width="6" height="1" fill="#042f2e" />
        <rect x="4" y="2" width="8" height="1" fill="#042f2e" />
        <rect x="3" y="3" width="10" height="9" fill="#042f2e" />
        <rect x="2" y="5" width="1" height="5" fill="#042f2e" />
        <rect x="13" y="5" width="1" height="5" fill="#042f2e" />
        {/* Legs outline */}
        <rect x="3" y="12" width="4" height="4" fill="#042f2e" />
        <rect x="9" y="12" width="4" height="4" fill="#042f2e" />

        {/* Body Cyan Base */}
        <rect x="4" y="3" width="8" height="9" fill="#06b6d4" />
        <rect x="5" y="2" width="6" height="1" fill="#06b6d4" />
        {/* Highlights */}
        <rect x="4" y="3" width="2" height="4" fill="#67e8f9" />
        <rect x="5" y="2" width="3" height="1" fill="#67e8f9" />
        {/* Feet */}
        <rect x="4" y="13" width="2" height="2" fill="#0891b2" />
        <rect x="10" y="13" width="2" height="2" fill="#0891b2" />

        {/* Giant Cyclops Eye */}
        <rect x="5" y="4" width="6" height="5" fill="#0f172a" />
        <rect x="6" y="5" width="4" height="3" fill="#ffffff" />
        {/* Pupil */}
        <rect x="7" y="6" width="2" height="2" fill="#020617" />
        <rect x="7" y="6" width="1" height="1" fill="#ffffff" />

        {/* Mouth */}
        <rect x="6" y="10" width="4" height="1" fill="#0f172a" />
      </svg>
    ),
  },
  {
    id: "imp",
    name: "EMBER",
    species: "Horned Imp",
    themeColor: "#f97316",
    renderSvg: () => (
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        shapeRendering="crispEdges"
      >
        {/* Horns */}
        <rect x="2" y="1" width="2" height="3" fill="#1c1917" />
        <rect x="12" y="1" width="2" height="3" fill="#1c1917" />

        {/* Body Outline */}
        <rect x="4" y="2" width="8" height="1" fill="#431407" />
        <rect x="3" y="3" width="10" height="9" fill="#431407" />
        <rect x="2" y="5" width="12" height="5" fill="#431407" />
        {/* Legs outline */}
        <rect x="3" y="12" width="4" height="4" fill="#431407" />
        <rect x="9" y="12" width="4" height="4" fill="#431407" />

        {/* Orange Body */}
        <rect x="4" y="3" width="8" height="9" fill="#f97316" />
        <rect x="3" y="5" width="10" height="5" fill="#f97316" />
        {/* Highlights */}
        <rect x="4" y="3" width="2" height="4" fill="#fdba74" />
        {/* Feet */}
        <rect x="4" y="13" width="2" height="2" fill="#c2410c" />
        <rect x="10" y="13" width="2" height="2" fill="#c2410c" />

        {/* Beady Eyes */}
        <rect x="5" y="5" width="2" height="2" fill="#000000" />
        <rect x="9" y="5" width="2" height="2" fill="#000000" />

        {/* Cute Wide Mouth */}
        <rect x="5" y="8" width="6" height="2" fill="#1c1917" />
        <rect x="6" y="8" width="1" height="1" fill="#ffffff" />
        <rect x="9" y="8" width="1" height="1" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "octo",
    name: "BUBBLE",
    species: "Space Octo",
    themeColor: "#ec4899",
    renderSvg: () => (
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        shapeRendering="crispEdges"
      >
        {/* Round Dome Outline */}
        <rect x="5" y="1" width="6" height="1" fill="#500724" />
        <rect x="4" y="2" width="8" height="1" fill="#500724" />
        <rect x="3" y="3" width="10" height="8" fill="#500724" />
        {/* Tentacle outlines */}
        <rect x="2" y="11" width="3" height="5" fill="#500724" />
        <rect x="5" y="11" width="2" height="4" fill="#500724" />
        <rect x="9" y="11" width="2" height="4" fill="#500724" />
        <rect x="11" y="11" width="3" height="5" fill="#500724" />

        {/* Pink Head */}
        <rect x="4" y="3" width="8" height="8" fill="#ec4899" />
        <rect x="5" y="2" width="6" height="1" fill="#ec4899" />
        {/* Highlights */}
        <rect x="5" y="2" width="3" height="2" fill="#fbcfe8" />
        {/* Tentacles */}
        <rect x="3" y="12" width="1" height="3" fill="#be185d" />
        <rect x="6" y="11" width="1" height="3" fill="#be185d" />
        <rect x="9" y="11" width="1" height="3" fill="#be185d" />
        <rect x="12" y="12" width="1" height="3" fill="#be185d" />

        {/* Wide Eyes */}
        <rect x="5" y="5" width="2" height="2" fill="#000000" />
        <rect x="5" y="5" width="1" height="1" fill="#ffffff" />
        <rect x="9" y="5" width="2" height="2" fill="#000000" />
        <rect x="9" y="5" width="1" height="1" fill="#ffffff" />

        {/* Happy Mouth */}
        <rect x="6" y="8" width="4" height="1" fill="#500724" />
      </svg>
    ),
  },
  {
    id: "gremlin",
    name: "SHADOW",
    species: "Violet Gremlin",
    themeColor: "#a855f7",
    renderSvg: () => (
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        shapeRendering="crispEdges"
      >
        {/* Bat Ears & Raised Arms */}
        <rect x="1" y="1" width="2" height="3" fill="#3b0764" />
        <rect x="13" y="1" width="2" height="3" fill="#3b0764" />
        <rect x="0" y="5" width="3" height="3" fill="#3b0764" />
        <rect x="13" y="5" width="3" height="3" fill="#3b0764" />

        {/* Body Outline */}
        <rect x="4" y="2" width="8" height="1" fill="#3b0764" />
        <rect x="3" y="3" width="10" height="9" fill="#3b0764" />
        {/* Legs outline */}
        <rect x="3" y="12" width="4" height="4" fill="#3b0764" />
        <rect x="9" y="12" width="4" height="4" fill="#3b0764" />

        {/* Purple Body */}
        <rect x="4" y="3" width="8" height="9" fill="#a855f7" />
        <rect x="1" y="6" width="2" height="2" fill="#a855f7" />
        <rect x="13" y="6" width="2" height="2" fill="#a855f7" />
        {/* Highlight */}
        <rect x="4" y="3" width="2" height="4" fill="#d8b4fe" />
        {/* Feet */}
        <rect x="4" y="13" width="2" height="2" fill="#7e22ce" />
        <rect x="10" y="13" width="2" height="2" fill="#7e22ce" />

        {/* Eyes */}
        <rect x="5" y="5" width="2" height="2" fill="#000000" />
        <rect x="9" y="5" width="2" height="2" fill="#000000" />

        {/* Grin with Tongue/Fangs */}
        <rect x="5" y="8" width="6" height="2" fill="#1e1b4b" />
        <rect x="7" y="9" width="2" height="1" fill="#f43f5e" />
        <rect x="6" y="8" width="1" height="1" fill="#ffffff" />
        <rect x="9" y="8" width="1" height="1" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "yeti",
    name: "MOCHI",
    species: "Horned Yeti",
    themeColor: "#b45309",
    renderSvg: () => (
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        shapeRendering="crispEdges"
      >
        {/* Yellow Horns */}
        <rect x="3" y="1" width="2" height="3" fill="#facc15" />
        <rect x="11" y="1" width="2" height="3" fill="#facc15" />

        {/* Brown Body Outline */}
        <rect x="4" y="2" width="8" height="1" fill="#291004" />
        <rect x="2" y="3" width="12" height="9" fill="#291004" />
        {/* Legs outline */}
        <rect x="3" y="12" width="4" height="4" fill="#291004" />
        <rect x="9" y="12" width="4" height="4" fill="#291004" />

        {/* Brown Fur Base */}
        <rect x="3" y="3" width="10" height="9" fill="#92400e" />
        <rect x="4" y="3" width="2" height="4" fill="#d97706" />
        {/* Feet */}
        <rect x="4" y="13" width="2" height="2" fill="#78350f" />
        <rect x="10" y="13" width="2" height="2" fill="#78350f" />

        {/* Retro Cyan Face Visor */}
        <rect x="5" y="5" width="6" height="3" fill="#042f2e" />
        <rect x="6" y="5" width="4" height="2" fill="#22d3ee" />
        {/* Eyes inside visor */}
        <rect x="7" y="5" width="1" height="1" fill="#042f2e" />
        <rect x="9" y="5" width="1" height="1" fill="#042f2e" />

        {/* Mouth */}
        <rect x="6" y="9" width="4" height="1" fill="#291004" />
      </svg>
    ),
  },
];
