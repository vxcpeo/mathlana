// Read-only pre-screen: which <name>.xyz are unregistered per CentralNic RDAP.
const names = process.argv.slice(2);
for (const name of names) {
  const url = `https://rdap.centralnic.com/xyz/domain/${name}.xyz`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    console.log(`${name.padEnd(11)} ${res.status} ${res.status === 404 ? "FREE" : "registered/unknown"}`);
  } catch (err) {
    console.log(`${name.padEnd(11)} ERR ${err.message}`);
  }
}
