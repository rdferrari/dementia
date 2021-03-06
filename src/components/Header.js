import React, { useState } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { UserContext } from "../App";

function Header({ history, handleSignOut }) {
  const [showMenu, setShowMenu] = useState(false);

  const path = history.location.pathname;

  return (
    <UserContext.Consumer>
      {({ user }) =>
        path !== "/" && (
          <div>
            <div className="header-container">
              {path === "/" ? (
                <div>
                  <img className="header-logo" src="/images/app-logo.svg" />
                </div>
              ) : (
                <div>
                  <img
                    onClick={() => history.goBack()}
                    className="header-back"
                    src="/images/backHeader.svg"
                  />
                </div>
              )}

              <div>
                <p className="header-title">Mate wareware</p>
              </div>
              <div>
                {showMenu === false ? (
                  <img
                    onClick={() => setShowMenu(true)}
                    className="header-menu"
                    src="/images/HamburgerMenu.svg"
                  />
                ) : (
                  <div>
                    <img
                      onClick={() => setShowMenu(false)}
                      className="header-menu"
                      src="/images/CloseMenu.svg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              {showMenu === true && (
                <div className="header-menu-body">
                  <NavLink to="/">
                    <p onClick={() => setShowMenu(false)}>Home</p>
                  </NavLink>
                  <NavLink to="/sections">
                    <p onClick={() => setShowMenu(false)}>Sections</p>
                  </NavLink>
                  {user ? (
                    <p onClick={() => handleSignOut()}>sign out</p>
                  ) : (
                    <NavLink to="/login">
                      <p onClick={() => setShowMenu(false)}>Login</p>
                    </NavLink>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      }
    </UserContext.Consumer>
  );
}

export default withRouter(Header);
