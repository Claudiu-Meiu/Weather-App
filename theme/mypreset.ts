// mypreset.ts
import { definePreset } from '@primeng/themes';
import Material from '@primeng/themes/material';

const MyPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
  components: {
    card: {
      root: {
        borderRadius: '20px',
      },
      body: {
        padding: '30px',
        gap: '10px',
      },
      colorScheme: {
        light: {
          root: {
            shadow: '0px 0px 0px 0px {surface.300}',
            background: '{surface.700}',
            color: '{surface.0}',
          },
          subtitle: {
            color: '{surface.500}',
          },
        },
        dark: {
          root: {
            shadow: '0px 0px 0px 0px {surface.600}',
            background: '{surface.900}',
            color: '{surface.0}',
          },
          subtitle: {
            color: '{surface.400}',
          },
        },
      },
    },
    menu: {
      item: {
        icon: {
          color: '{primary.color}',
          focusColor: '{primary.color}',
        },
      },
    },
  },
});

export default MyPreset;
