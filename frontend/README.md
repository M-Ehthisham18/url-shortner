# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



<!-- 
<div className="bg-zinc-800 p-8 rounded-lg w-full max-w-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">URL Shortener</h1>
        <p className="text-center text-zinc-400 mb-6">
          Create short, shareable links instantly
        </p>

        {/* Input fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm">Original URL</label>
            <input
              type="url"
              placeholder="https://example.com/long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600"
            />
          </div>
          <div>
            <label className="text-sm">Custom Alias (Optional)</label>
            <input
              type="text"
              placeholder="my-custom-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600"
            />
          </div>
        </div>

        {/* Output URL */}
        {(shortenedUrl || isWaitingToShowUrl) && (
          <div className="mb-4">
            <label className="text-sm">Shortened URL</label>
            <div className="xs:w-full flex gap-2 mt-1">
              {isWaitingToShowUrl ? (
                <div className="flex-1 p-2 rounded bg-zinc-700 text-zinc-400 border border-zinc-600 animate-pulse text-center">
                  Loading...
                </div>
              ) : (
                <>
                  <input
                    value={shortenedUrl}
                    readOnly
                    className=" flex-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600"
                  />
                  <button
                    onClick={handleCopy}
                    className=" bg-zinc-600 px-3 py-2 rounded hover:bg-zinc-500"
                  >
                    <Copy/>
                  </button>
                  <button
                    onClick={openUrl}
                    className=" bg-zinc-600 px-3 py-2 rounded hover:bg-zinc-500"
                  >
                    <ExternalLink/>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={handleShorten}
            className="bg-green-600 w-full py-2 rounded hover:bg-green-500 text-white font-semibold flex items-center justify-center gap-2"
          >
            🔗 Shorten URL
          </button>
          <button
            onClick={handleGenerateQR}
            disabled={!shortenedUrl}
            className="bg-zinc-700 w-full py-2 rounded hover:bg-zinc-600 disabled:opacity-50"
          >
            🧾 Generate QR Code
          </button>
        </div>

        {/* QR Code */}
        {(qrUrl || isGeneratingQR) && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">QR Code</h3>

            {isGeneratingQR ? (
              <>
              <div className="w-48 h-48 mx-auto bg-zinc-700 animate-pulse rounded flex items-center justify-center flex-col" >
              <Loader2Icon className="w-24 h-24 animate-spin mb-1" />
              loading...
                </div>
              </>
            ) : (
              <>
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="mx-auto w-48 h-48 bg-white p-2 rounded"
                  id="qr-image"
                />
                <p className="text-sm text-zinc-400 mt-2">
                  Scan this to visit the short link
                </p>

                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = qrUrl;
                      link.download = "qr-code.png";
                      link.click();
                    }}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 flex justify-even items-center gap-2"
                  >
                    <Download /> QR
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "QR Code",
                          text: "Scan this QR Code to open the link",
                          url: qrUrl,
                        });
                      } else {
                        toast.error("Sharing not supported in this browser.");
                      }
                    }}
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 flex justify-even items-center gap-2"
                  >
                    <Share2/> QR
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <AnalyticsCard/>
       -->