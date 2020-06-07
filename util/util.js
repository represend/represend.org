module.exports = {
  findLocation: async () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const payload = {
              latlng: `${position.coords.latitude},${position.coords.longitude}`
            }
            try {
              const response = await fetch(
                "/api/locate",
                {
                  method: "POST",
                  body: payload
                }
              );
              if (response.ok) {
                const data = await response.json();
                resolve(data.address);
              } else {
                reject(new Error(`Server Error ${response.status}: ${response.statusText}`));
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