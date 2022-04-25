# Final Fantasy 6 Builder

### Requirements
* Node (works with v16, untested on earlier)
* npm

### Get started

1. Install the single dependency (https://github.com/bropedio/rom-builder)
```
npm install
```

2. Dump the data from your legally-obtained ROM.sfc file
```
node app dump ROM.sfc
```

3. View dumped json and txt inside newly-created `dump` directory

4. Make whatever changes you want

5. Move/rename `dump` directory to `data` directory, which is where `rom-builder` looks for source data

6. Create a test copy of your legally-obtained ROM.sfc

7. For fast build, run:
```
node app fastcompile test.sfc
```

8. For full optimization and automated schema testing, run:
```
node app compile test.sfc
```
