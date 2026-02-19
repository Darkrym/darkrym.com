# darkrym.com

Personal website for Darkrym, built with Hugo and the Blowfish theme.

## Installation Instructions

### Initial Setup on Server

1. **Install Hugo** (if not already installed):
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install hugo

   # On macOS
   brew install hugo
   ```

2. **Clone the repository** (using the lite branch):
   ```bash
   git clone -b blowfish-lite https://github.com/Darkrym/darkrym.com.git
   cd darkrym.com
   ```

3. **Install Blowfish theme**:
   ```bash
   git clone https://github.com/nunocoracao/blowfish.git themes/blowfish
   ```

4. **Build the site**:
   ```bash
   hugo
   ```

   The built site will be in the `public/` directory.

### Updating Content

To pull the latest changes from GitHub:

```bash
cd darkrym.com
git pull origin blowfish-lite
hugo
```

### Updating the Blowfish Theme

If you need to update the Blowfish theme to the latest version:

```bash
cd themes/blowfish
git pull origin main
cd ../..
hugo
```

## Repository Branches

- **blowfish**: Complete setup including theme as submodule
- **blowfish-lite**: Site content only (theme installed separately on server)

## Documentation

For more information about the Blowfish theme, visit the [official documentation](https://nunocoracao.github.io/blowfish/).
