# Sistema de Modales Centralizado

Este documento explica cómo usar el sistema de gestión de modales centralizado con Zustand en la aplicación.

## Arquitectura

El sistema de modales está compuesto por:

1. **Store global** (`app/(private)/store/modals.slice.ts`): Gestiona el estado de todos los modales
2. **Hook personalizado** (`app/(private)/hooks/useModal.ts`): Simplifica el uso del store
3. **Componente Modal** (`components/ui/modal.tsx`): Componente reutilizable para renderizar modales

## Beneficios

✅ **Centralización**: Todos los modales en un solo lugar
✅ **Consistencia**: UI y comportamiento uniforme
✅ **Simplicidad**: API fácil de usar
✅ **Type-safe**: Tipos de modales definidos y validados
✅ **Performance**: Estado optimizado con Zustand
✅ **Accesibilidad**: Cierre con ESC y click fuera del modal

## Uso Básico

### 1. Usar un modal existente

```tsx
import { useModal } from "@/app/(private)/hooks/useModal";
import { Modal, ModalFooter } from "@/components/ui/modal";

export default function MyPage() {
  const productModal = useModal("createProduct");

  return (
    <>
      <Button onClick={() => productModal.open()}>
        Crear Producto
      </Button>

      <Modal
        isOpen={productModal.isOpen}
        onClose={productModal.close}
        title="Crear Producto"
        description="Completa los datos del producto"
      >
        {/* Contenido del modal */}
        <div>Formulario aquí...</div>

        <ModalFooter>
          <Button variant="outline" onClick={productModal.close}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

### 2. Pasar datos al modal

```tsx
// Abrir modal con datos
productModal.open({ productId: "123" });

// Acceder a los datos
const { data } = useModal("editProduct");
console.log(data); // { productId: "123" }
```

### 3. Múltiples modales en una página

```tsx
const createModal = useModal("createProduct");
const editModal = useModal("editProduct");
const deleteModal = useModal("deleteProduct");

// Cada modal se gestiona independientemente
```

## API del Hook `useModal`

```tsx
const modal = useModal("modalType");

// Propiedades
modal.isOpen    // boolean - Estado del modal
modal.data      // any - Datos pasados al modal

// Métodos
modal.open(data?: any)  // Abrir modal con datos opcionales
modal.close()           // Cerrar modal
```

## Componente Modal

### Props

```tsx
interface ModalProps {
  isOpen: boolean;              // Estado del modal
  onClose: () => void;          // Callback para cerrar
  title?: string;               // Título del modal
  description?: string;         // Descripción opcional
  children: React.ReactNode;    // Contenido
  size?: "sm" | "md" | "lg" | "xl" | "full";  // Tamaño (default: "lg")
  showCloseButton?: boolean;    // Mostrar botón X (default: true)
  closeOnOverlayClick?: boolean; // Cerrar al click fuera (default: true)
}
```

### Tamaños disponibles

- `sm`: 384px (max-w-sm)
- `md`: 448px (max-w-md)
- `lg`: 672px (max-w-2xl) - **Default**
- `xl`: 896px (max-w-4xl)
- `full`: Ancho completo con margen

### Componente ModalFooter

```tsx
<ModalFooter>
  <Button variant="outline">Cancelar</Button>
  <Button>Guardar</Button>
</ModalFooter>
```

Características:
- Borde superior automático
- Alineación a la derecha
- Espaciado consistente
- Márgenes ajustados

## Agregar Nuevos Modales

### Paso 1: Definir el tipo de modal

Edita `app/(private)/store/modals.slice.ts`:

```tsx
export type ModalType =
  | "createProduct"
  | "editProduct"
  | "myNewModal"  // ← Agregar aquí
  | null;
```

### Paso 2: Usar el modal

```tsx
const myModal = useModal("myNewModal");

<Modal
  isOpen={myModal.isOpen}
  onClose={myModal.close}
  title="Mi Nuevo Modal"
>
  {/* Contenido */}
</Modal>
```

## Ejemplos Avanzados

### Modal con formulario

```tsx
export default function ProductsPage() {
  const modal = useModal("createProduct");
  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    // Lógica de guardado
    createProduct(form);
    modal.close();
    setForm(initialForm);
  };

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={() => {
        modal.close();
        setForm(initialForm);
      }}
      title="Crear Producto"
    >
      <div className="space-y-3">
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {/* Más campos... */}
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={modal.close}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          Crear
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

### Modal de confirmación

```tsx
const deleteModal = useModal("deleteProduct");

<Modal
  isOpen={deleteModal.isOpen}
  onClose={deleteModal.close}
  title="¿Eliminar producto?"
  description="Esta acción no se puede deshacer"
  size="sm"
>
  <ModalFooter>
    <Button variant="outline" onClick={deleteModal.close}>
      Cancelar
    </Button>
    <Button variant="destructive" onClick={handleDelete}>
      Eliminar
    </Button>
  </ModalFooter>
</Modal>
```

### Edición con datos

```tsx
const editModal = useModal("editProduct");

// Abrir modal con datos del producto
const handleEdit = (product: Product) => {
  setForm(product);
  editModal.open(product.id);
};

// En el submit
const handleUpdate = () => {
  if (editModal.data) {
    updateProduct(editModal.data, form);
  }
  editModal.close();
};
```

## Cerrar Todos los Modales

```tsx
import { useCloseAllModals } from "@/app/(private)/hooks/useModal";

const closeAll = useCloseAllModals();

// Cerrar todos los modales abiertos
closeAll();
```

## Características de Accesibilidad

El componente Modal incluye:

- ✅ Cierre con tecla **ESC**
- ✅ Cierre al hacer click fuera (configurable)
- ✅ Bloqueo de scroll del body cuando está abierto
- ✅ Animaciones suaves de entrada/salida
- ✅ Enfoque adecuado
- ✅ z-index alto (50) para superposición correcta

## Tipos de Modales Actuales

| Tipo | Descripción |
|------|-------------|
| `createProduct` | Crear nuevo producto |
| `editProduct` | Editar producto existente |
| `createCategory` | Crear nueva categoría |
| `editCategory` | Editar categoría |
| `createSupplier` | Crear nuevo proveedor |
| `editSupplier` | Editar proveedor |
| `createPurchase` | Registrar compra |
| `editPurchase` | Editar compra |
| `createSale` | Registrar venta |
| `editSale` | Editar venta |
| `createCustomer` | Crear cliente |
| `editCustomer` | Editar cliente |
| `createEmployee` | Crear empleado |
| `editEmployee` | Editar empleado |

## Best Practices

### ✅ DO

- Usar `ModalFooter` para botones de acción
- Resetear el formulario al cerrar
- Proveer título y descripción claros
- Usar el tamaño apropiado según el contenido
- Manejar estados de carga en los botones

### ❌ DON'T

- No usar estado local para controlar modales
- No olvidar limpiar los datos al cerrar
- No crear modales anidados (modal dentro de modal)
- No bloquear el cierre con ESC sin motivo
- No omitir botones de cancelar

## Migración de Modales Existentes

Si tienes un modal con estado local:

```tsx
// ANTES ❌
const [open, setOpen] = useState(false);

// DESPUÉS ✅
const modal = useModal("myModal");
```

Reemplazar:
- `open` → `modal.isOpen`
- `setOpen(true)` → `modal.open()`
- `setOpen(false)` → `modal.close()`

## Troubleshooting

**Modal no se cierra:**
- Verificar que `onClose` esté llamando a `modal.close()`
- Revisar que no haya preventDefault en eventos

**Datos no se pasan correctamente:**
- Asegurarse de usar `modal.open(data)` con el objeto correcto
- Verificar con `console.log(modal.data)`

**Modal se renderiza pero no se ve:**
- Verificar que `isOpen` esté correctamente vinculado
- Revisar z-index de otros elementos

**Múltiples modales abiertos:**
- Cerrar el modal anterior antes de abrir uno nuevo
- O usar `closeAllModals()` si es necesario
