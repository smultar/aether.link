function Component({ config, window }) {
    return (
        <div id="dock-render">
            <div id="dock-render-content">
                {/* Header */}
                <div id="header">
                    <div className="header-title">
                        <p className="title">TTMP Tweaker</p>
                        <p className="link">Issues</p>
                        <p className="link">Changes</p>
                    </div>
                    <p className="description">Modules description for a <span className="tag">.module</span> type file.</p>
                </div>
                {/* Body */}
                <div id="body">
                    <div className="body-pri">
                        <div className="body-empty">
                            <div className="not-loaded">No content</div>
                        </div>
                    </div>
                    <div className="body-sec"></div>
                </div>
            </div>
        </div>
    );
  };
  
  export default Component;
  