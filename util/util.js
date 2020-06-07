module.exports = {
  findLocation: async () => {
    return new Promise((resolve, reject) => {
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
      const payload = {
        address: address
      }
      try {
        const response = await fetch(
          "api/query",
          {
            method: "POST",
            body: payload
          }
        )
        if (response.ok) {
          const data = await response.json()
          resolve(data.reps);
        } else {
          reject(new Error(`Server Error ${response.status}: ${response.statusText}`));
        }
      } catch (error) {
        reject(error);
      }
    })
  }
}