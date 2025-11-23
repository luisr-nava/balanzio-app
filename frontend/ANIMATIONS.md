# Sistema de Animaciones con Framer Motion

Este documento explica cómo usar el sistema de animaciones implementado con Framer Motion en la aplicación.

## Instalación

Framer Motion ya está instalado en el proyecto:

```bash
npm install framer-motion
```

## Arquitectura

El sistema de animaciones está compuesto por:

1. **Variantes de animación** (`lib/animations.ts`): Configuraciones reutilizables de animaciones
2. **Componentes animados**: Componentes que usan las variantes para crear transiciones suaves

## Variantes Disponibles

### 1. Modales (`modalVariants`)

Animaciones para modales con efecto de escala y fade.

```tsx
import { motion, AnimatePresence } from "framer-motion";
import { modalVariants, overlayVariants } from "@/lib/animations";

<AnimatePresence>
  {isOpen && (
    <>
      <motion.div variants={overlayVariants} initial="hidden" animate="visible" exit="exit">
        {/* Overlay */}
      </motion.div>
      <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit">
        {/* Modal content */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**Características:**
- Fade in/out con opacidad
- Efecto de escala (0.95 → 1)
- Movimiento desde abajo (y: 20 → 0)
- Duración: 200ms entrada, 150ms salida

### 2. Filas Expandibles (`expandableRowVariants`)

Animaciones para contenido expandible como tablas o acordeones.

```tsx
import { motion, AnimatePresence } from "framer-motion";
import { expandableRowVariants } from "@/lib/animations";

<AnimatePresence initial={false}>
  {isOpen && (
    <motion.div
      initial="collapsed"
      animate="expanded"
      exit="collapsed"
      variants={expandableRowVariants}
      className="overflow-hidden"
    >
      {/* Contenido expandible */}
    </motion.div>
  )}
</AnimatePresence>
```

**Características:**
- Altura automática (0 → auto)
- Fade in/out
- Duración: 300ms
- `initial={false}` previene animación en montaje inicial

### 3. Fade In (`fadeInVariants`)

Animación simple de aparición.

```tsx
<motion.div variants={fadeInVariants} initial="hidden" animate="visible">
  {/* Contenido */}
</motion.div>
```

### 4. Slide Up (`slideUpVariants`)

Deslizamiento desde abajo con fade.

```tsx
<motion.div variants={slideUpVariants} initial="hidden" animate="visible">
  {/* Contenido */}
</motion.div>
```

### 5. Listas con Stagger (`listContainerVariants`, `listItemVariants`)

Animación escalonada para listas de elementos.

```tsx
<motion.ul variants={listContainerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item.id} variants={listItemVariants}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

**Características:**
- Delay de 50ms entre cada elemento
- Efecto de deslizamiento desde la izquierda

### 6. Cards (`cardVariants`)

Animación para cards con slide up.

```tsx
<motion.div variants={cardVariants} initial="hidden" animate="visible">
  <Card>{/* ... */}</Card>
</motion.div>
```

## Animaciones Directas

### Hover y Tap en Botones

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Botón animado
</motion.button>
```

### Rotación del Chevron

```tsx
<motion.div
  animate={{ rotate: isOpen ? 180 : 0 }}
  transition={{ duration: 0.3 }}
>
  <ChevronDown className="h-4 w-4" />
</motion.div>
```

### Hover en Filas de Tabla

```tsx
<motion.button
  whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
  whileTap={{ scale: 0.995 }}
  className="w-full text-left"
>
  {/* Contenido de la fila */}
</motion.button>
```

## Ejemplos Implementados

### 1. Modal Animado

Ubicación: `components/ui/modal.tsx`

```tsx
<AnimatePresence>
  {isOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full rounded-lg bg-background shadow-xl"
      >
        {/* Contenido */}
      </motion.div>
    </div>
  )}
</AnimatePresence>
```

### 2. Tabla Expandible

Ubicación: `app/(private)/dashboard/products/page.tsx`

```tsx
{products.map((product) => {
  const isOpen = expandedRow === product.id;
  return (
    <div key={product.id}>
      {/* Fila principal */}
      <motion.button
        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        whileTap={{ scale: 0.995 }}
        onClick={() => setExpandedRow(isOpen ? null : product.id)}
      >
        {/* Contenido de la fila */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown />
        </motion.div>
      </motion.button>

      {/* Contenido expandible */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={expandableRowVariants}
            className="overflow-hidden"
          >
            {/* Detalles del producto */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
})}
```

### 3. Lista con Stagger (Items de Venta)

Ubicación: `app/(private)/dashboard/sales/page.tsx`

```tsx
<AnimatePresence initial={false}>
  {isOpen && (
    <motion.div variants={expandableRowVariants}>
      <div className="space-y-1">
        {sale.items?.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-md border bg-background px-3 py-2"
          >
            {/* Contenido del item */}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

## Best Practices

### ✅ DO

1. **Usar AnimatePresence para elementos condicionales:**
```tsx
<AnimatePresence>
  {show && <motion.div exit="hidden">...</motion.div>}
</AnimatePresence>
```

2. **Aplicar `initial={false}` en expandibles:**
```tsx
<AnimatePresence initial={false}>
  {isOpen && <motion.div>...</motion.div>}
</AnimatePresence>
```

3. **Usar variantes para animaciones complejas:**
```tsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

4. **Combinar animaciones para mejor UX:**
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

5. **Usar className="overflow-hidden" en expandibles:**
```tsx
<motion.div
  variants={expandableRowVariants}
  className="overflow-hidden"
>
```

### ❌ DON'T

1. **No animar propiedades pesadas (evitar cambios de layout):**
```tsx
// ❌ Malo - causa reflow
<motion.div animate={{ width: 500 }} />

// ✅ Bueno - usa transform
<motion.div animate={{ scale: 1.5 }} />
```

2. **No usar duraciones muy largas:**
```tsx
// ❌ Muy lento
transition={{ duration: 1 }}

// ✅ Rápido y fluido
transition={{ duration: 0.3 }}
```

3. **No olvidar AnimatePresence en condicionales:**
```tsx
// ❌ Sin animación de salida
{show && <motion.div>...</motion.div>}

// ✅ Con animación de salida
<AnimatePresence>
  {show && <motion.div>...</motion.div>}
</AnimatePresence>
```

4. **No usar layout animations sin necesidad:**
```tsx
// ❌ Innecesario para elementos simples
<motion.div layout>Simple div</motion.div>

// ✅ Solo cuando el layout cambia
<motion.div layout>{items.map(...)}</motion.div>
```

## Personalización

### Crear Nuevas Variantes

Edita `lib/animations.ts`:

```tsx
export const customVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};
```

### Ajustar Duraciones

```tsx
// Global
export const modalVariants: Variants = {
  visible: {
    transition: { duration: 0.5 } // Cambiar aquí
  }
};

// O sobrescribir localmente
<motion.div
  variants={modalVariants}
  transition={{ duration: 0.8 }}
/>
```

## Performance

### Optimizaciones Aplicadas

1. **Transform y Opacity**: Propiedades GPU-accelerated
2. **will-change**: Framer Motion lo maneja automáticamente
3. **AnimatePresence**: Evita re-renders innecesarios
4. **Stagger moderado**: 50ms de delay entre elementos

### Consejos

- Usa `layoutId` para animaciones compartidas entre componentes
- Evita animar muchos elementos simultáneamente (>50)
- Prefiere `transform` sobre `width/height`
- Usa `initial={false}` cuando no necesites animación inicial

## Troubleshooting

**Animación no se ejecuta:**
- Verifica que AnimatePresence envuelva el componente
- Asegúrate de que la key del elemento cambie si es necesario
- Revisa que initial, animate y exit estén correctos

**Animación se ve entrecortada:**
- Reduce la duración (0.2-0.3s es óptimo)
- Evita animar width/height, usa scale
- Verifica que no haya renders excesivos

**Contenido expandible no se ve:**
- Asegura que tenga `overflow-hidden`
- Verifica que `height: "auto"` esté en el estado expanded
- Usa `initial={false}` en AnimatePresence

## Recursos

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animaciones en React](https://www.framer.com/motion/animation/)
- [Variants](https://www.framer.com/motion/animation/#variants)
- [AnimatePresence](https://www.framer.com/motion/animate-presence/)
