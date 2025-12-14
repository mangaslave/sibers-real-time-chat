import Face from "../assets/loginFront.png";
import FaceClosed from "../assets/loginBack.png";

export default function Pet({ isFocused }) {
  return (
    <div className="relative w-1/2 max-w-xs aspect-square mx-auto">
      {/* Face open */}
      <img
        src={Face}
        alt="Face open"
        className={`absolute inset-0 w-full h-11/12 object-contain transition-opacity duration-300 ${
          isFocused ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Face closed */}
      <img
        src={FaceClosed}
        alt="Face closed"
        className={`absolute inset-0 w-full h-11/12 object-contain transition-opacity duration-300 ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
