import 'material-symbols';
import { FC, useEffect, useRef, useState, Fragment } from "react";
import "./sidebar.css";
import crLogo from "./cr-logo.png";
import { Link } from "react-router-dom";

const menuItems = [
  {
    name: "Usuarios",
    icon: "person",
    route: "/usuario",
  },
  {
    name: "Smart Voice",
    icon: "voice_chat",
    items: [
      { name: "Directo", route: "/smartvoice/directo" },
      { name: "Procesador de audios", route: "/smartvoice/transcripciones" },
    ],
  },
  {
    name: "Estadísticas",
    icon: "analytics",
    items: [
      { name: "Gráficos", route: "/estadisticas/graficos" },
      { name: "Preguntas", route: "/estadisticas/preguntas" },
    ],
  },
];


type Item = {
  name: string;
  icon: string;
  route?: string;
  items?: { name: string; route: string }[]; // Modifica esta línea
};

type IconProps = {
  icon: string;
  className?: string; // Añade la propiedad className opcional aquí
};

const Icon = ({ icon, className }: IconProps) => (
  <span className={`material-symbols-outlined ${className || ""}`}>{icon}</span>
);

type NavHeaderProps = {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
};

const NavHeader = ({ toggleSidebar, sidebarOpen }: NavHeaderProps) => (
  <header className="sidebar-header">
    <div className="menu-button-container">
      <button type="button" onClick={toggleSidebar}>
        <div className="menu-button">
          <Icon icon={sidebarOpen ? "close" : "menu"} className="menu-icon" />
        </div>
      </button>
      {sidebarOpen && (
        <img src={crLogo} alt="Close" className="cr-logo" />
      )}
    </div>
  </header>
);


type ButtonProps = {
  onClick: (item: string) => void;
  name: string;
  icon?: string;
  isActive: boolean;
  hasSubNav?: boolean;
  isDisabled: boolean;
  route?: string; // Haz esta línea opcional
};

const NavButton: FC<ButtonProps> = ({
  onClick,
  name,
  icon,
  isActive,
  hasSubNav,
  isDisabled,
  route,
}) => {
  const buttonContent = (
    <button
      type="button"
      onClick={() => onClick(name)}
      className={`${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`}
      disabled={isDisabled}
    >
      {icon && <Icon icon={icon} />}
      <span>{name}</span>
      {hasSubNav && (
        <Icon
          icon={`expand_${isActive ? "less" : "more"}`}
          className="dropdown-arrow"
        />
      )}
    </button>
  );

  return route ? (
    <Link to={route}>{buttonContent}</Link>
  ) : (
    buttonContent
  );
};


type SubMenuProps = {
  item: Item;
  activeItem: string;
  handleClick: (args0: string) => void;
  sidebarOpen: boolean;
};

const SubMenu: FC<SubMenuProps> = ({ item, activeItem, handleClick, sidebarOpen }) => {
  const navRef = useRef<HTMLDivElement>(null);

  const isSubNavOpen = (item: string, items?: { name: string; route: string }[]) =>
    items?.some((i) => i.name === activeItem) || item === activeItem;

  return (
    <div
      className={`sub-nav ${isSubNavOpen(item.name, item.items) ? "open" : ""}`}
      style={{
        height: !isSubNavOpen(item.name, item.items)
          ? 0
          : navRef.current?.clientHeight,
      }}
    >
      <div ref={navRef} className="sub-nav-inner">
        {item?.items?.map((subItem) => (
          <NavButton
            key={subItem.name}
            onClick={handleClick}
            name={subItem.name}
            isActive={activeItem === subItem.name}
            isDisabled={!sidebarOpen}
            route={subItem.route} // Pasa la propiedad route aquí
          />
        ))}
      </div>
    </div>
  );
};


type SidebarProps = {
  handleClick: (item: string) => void;
};

export const Sidebar = ({ handleClick }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleItemClick = (item: string) => {
    setActiveItem(item !== activeItem ? item : "");
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (!sidebarOpen) {
      setActiveItem("");
    }
  }, [sidebarOpen]);

  return (
    <aside className={`sidebar ${!sidebarOpen ? "sidebar-closed" : ""}`}>
      <NavHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="sidebar-content">
        {menuItems.map((item) => (
          <Fragment key={item.name}>
            <NavButton
              onClick={handleItemClick}
              name={item.name}
              icon={item.icon}
              isActive={activeItem === item.name}
              hasSubNav={!!item.items}
              isDisabled={!sidebarOpen}
              route={item.route} // Pasa la propiedad route aquí
            />
            {item.items && (
              <SubMenu
                activeItem={activeItem}
                handleClick={handleItemClick}
                item={item}
                sidebarOpen={sidebarOpen}
              />
            )}
          </Fragment>
        ))}
      </div>
    </aside>
  );
};
