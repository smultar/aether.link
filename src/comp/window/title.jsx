function Component({ config, window }) {
  return (
      <div id="title">
          <div className="left">
              <img src="/icons/logo-white.svg"></img>
              <p className="name">{config.name.display}</p>
              <p className="dash">-</p>
              { false && <p className="module">module name</p>}
              <p className="version">{config.version}</p>
          </div>
          <div className="right">
              <img className="sync-check" src="svg/sync-d.svg"></img>
              <img className="download" src="svg/download.svg"></img>
              <img onClick={() => { window.link.action.minimize() }} className="button" src="svg/minimize.svg"></img>
              <img onClick={() => { window.link.action.close() }} className="close" src="svg/close.svg"></img>
          </div>
      </div>
  );
};

export default Component;
