# battlespace-telemetry

What this is? A suite of sensors provided by the browser, along with an async iterator into which new sensors can be plugged. The iterator can be configured to yield events under certain conditions and with certain metadata. The sensor classes can be modified and the super class may be subclassed to support the integration of new sensors.

It is both limited, in that it does include all sensors provided by browsers, and bespoke, in that it does not attempt to follow any external standard, such as the experimental Sensor API provided by the browser.

It is both an experiment for fun and exploration, as well as a practical piece of code that could be used for applications such as: 

- personal, offline, private self-location without using anything more than GPS;
- cool visualizations of how you or your device are moving in space and time;
- creation of a compass or level;

# What are its limitations?

- Covers only a few sensors, see [index.html](index.html) for the current list.
- Is in alpha so has neither a stable API nor freedom from bugs.

# What is its purpose?

The ultimate purpose as envisaged is the provision of data for sensor visualization. It would be cool to visualize all information the phone provides in order to orient one on the planet, and provide a very rough, offline world map. Other applications could be devised.

# What is not its purpose?

It is not intended to be used in any way for tracking, fingerprinting and the like, but indeed it could be used in such a way, and yet it does not significantly enhance the latent capability of existing browser APIs merely by existing. 

Regardless of that, it is expected that people will react to this as if it were a byzantine abomination of cruelty and malice, intended solely to pry from their private decies their most intimate secrets and target them with ads, malware and worse.

Indeed, it is none of these things, but it will be seen that way by some. It is important to remember that the code and the live demo are comprised solely of client-side JavaScript that makes no calls to any external APIs, and run completely on your device without exception. All data provided by the sensors already existing on your device is display solely on the textarea in the middle of your screen, nowhere else.

Fears of tracking are understandable, but in this case are unwarranted. Fears that this could be used by bad actors for tracking are justified, but could be considered somewhat misplaced given that the code does not attempt to circumvent any permissions, and does nothing more than unify data available from device sensors and wrap their diverse APIs in a more unified interface.

# Why did you create it?

I liked thinking about how to unify the APIs as well as how one might use an async iterator to yield a sequence of sensor-based events.

# Why is it called "battlespace telemetry"?

Mostly because it sounds cool. The name came to me when I was thinking of the project, I suppose because the idea of providing a sensor fusion interface could be considered to be closely linked with the military domain.

# Can I get involved?

Sure, I'd love that! Likely there are other projects on GitHub doing the same thing, but I think this would be really cool to:

- provide an interface (Sensor subclass) for all possible sensors across all mainstream personal communications devices that can run a web browser and are accessible through its JS APIs.
- provide consistent data formats handling of differences arising from cross-browser API variations, as well as device sensor availiabilities
- maintain a simple "client side only" demo page that provides an immediate and interactable overview of its capabilities

# What is the overarching philosophy?

To get as much info out of the device as possible. To create fusion of a "System Information / Device Specs" window with a "Sensor Dashboard". Our devices provide an incredible amount of information, and this fascinates me. Also, unifying data, opening up access, and pushing the browser APIs as far as they can go are pretty interesting. I've explored similar ideas in other browser-related projects, chiefly: [BrowserBox](https://github.com/BrowserBox/BrowserBox) a multiplayer remote browser embeddable in your app, and [DownloadNet](https://github.com/dosyago/DownloadNet) a personal search engine of your browser history with an offline archive of stuff you browse.

