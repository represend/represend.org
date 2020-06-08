module.exports = {
  findLocation: async () => {
    return new Promise(async (resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const response = await fetch(
                "/api/locate",
                {
                  method: "POST",
                  body: JSON.stringify({latlng: `${position.coords.latitude},${position.coords.longitude}`}),
                  headers: {"Content-Type": "application/json"},
                }
              );
              if (response.ok) {
                const data = await response.json();
                resolve(data.address);
              } else {
                const error = await response.json()
                reject(new Error(`Server Error ${response.status}: ${response.statusText}. ${error.message}`));
              }
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            reject(error);
          }
        ); 
      } else {
        reject(new Error("Geolocation not available"));
      }
    });
  },

  searchCivics: async (address) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          "/api/query",
          {
            method: "POST",
            body: JSON.stringify({address: address}),
            headers: {"Content-Type": "application/json"},
          },
        )
        if (response.ok) {
          const data = await response.json();
          resolve(data.address);
        } else {
          const error = await response.json()
          reject(new Error(`Server Error ${response.status}: ${response.statusText}. ${error.message}`));
        }
      } catch (error) {
        reject(error);
      }
    })
  }
}