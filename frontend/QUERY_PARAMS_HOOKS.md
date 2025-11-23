# Hooks para Query Params con Debounce

Sistema de hooks personalizados para manejar parámetros de URL de forma eficiente con debounce automático.

## Hooks Disponibles

### 1. `useDebounce`

Hook básico para aplicar debounce a cualquier valor.

```tsx
import { useDebounce } from "@/app/(private)/hooks/useDebounce";

const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 500); // 500ms de delay

// debouncedSearch solo se actualiza después de 500ms de inactividad
```

#### API

```tsx
function useDebounce<T>(value: T, delay?: number): T
```

**Parámetros:**
- `value`: Valor a aplicar debounce
- `delay`: Tiempo de espera en milisegundos (default: 500)

**Retorna:**
- Valor con debounce aplicado

#### Ejemplo

```tsx
function SearchInput() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  // Solo se ejecuta después de 300ms sin escribir
  useEffect(() => {
    console.log("Buscar:", debouncedSearch);
  }, [debouncedSearch]);

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Buscar..."
    />
  );
}
```

---

### 2. `useQueryParams`

Hook genérico para manejar cualquier parámetro de URL con tipo personalizado.

```tsx
import { useQueryParams } from "@/app/(private)/hooks/useQueryParams";

// Con tipos personalizados
interface MyParams {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

const {
  params,
  updateParams,
  getParam,
  resetParams,
  removeParams,
} = useQueryParams<MyParams>();
```

#### API

```tsx
function useQueryParams<T extends QueryParams>(
  options?: UseQueryParamsOptions
): {
  params: T;
  updateParams: (updates: Partial<T>, options?: UpdateOptions) => void;
  getParam: <K extends keyof T>(key: K, defaultValue?: T[K]) => T[K] | undefined;
  resetParams: () => void;
  removeParams: (...keys: (keyof T)[]) => void;
}
```

**Opciones:**
```tsx
interface UseQueryParamsOptions {
  debounceDelay?: number;       // Delay para debounce (default: 500)
  debounceKeys?: string[];      // Keys que aplicarán debounce (default: ["search"])
}
```

**UpdateOptions:**
```tsx
interface UpdateOptions {
  scroll?: boolean;    // Hacer scroll al top (default: false)
  replace?: boolean;   // Usar replace en lugar de push (default: false)
}
```

#### Métodos

##### `updateParams(updates, options?)`
Actualiza uno o más parámetros en la URL.

```tsx
// Actualizar un parámetro
updateParams({ search: "producto" });

// Actualizar múltiples parámetros
updateParams({
  search: "producto",
  category: "electrónica",
  page: 1
});

// Con opciones
updateParams({ search: "nuevo" }, { replace: true });
```

##### `getParam(key, defaultValue?)`
Obtiene un parámetro específico con valor por defecto opcional.

```tsx
const category = getParam("category", "todos");
const page = getParam("page", 1);
```

##### `resetParams()`
Resetea todos los parámetros de la URL.

```tsx
resetParams(); // URL → /ruta-actual (sin params)
```

##### `removeParams(...keys)`
Elimina parámetros específicos de la URL.

```tsx
removeParams("search", "category");
```

#### Ejemplo Completo

```tsx
function ProductFilters() {
  const {
    params,
    updateParams,
    getParam,
    resetParams,
  } = useQueryParams<{
    search: string;
    category: string;
    minPrice: number;
    maxPrice: number;
  }>();

  return (
    <div>
      <input
        value={params.search || ""}
        onChange={(e) => updateParams({ search: e.target.value })}
      />

      <select
        value={params.category || ""}
        onChange={(e) => updateParams({ category: e.target.value })}
      >
        <option value="">Todas</option>
        <option value="electronics">Electrónica</option>
        <option value="clothing">Ropa</option>
      </select>

      <button onClick={resetParams}>Limpiar filtros</button>
    </div>
  );
}
```

---

### 3. `usePaginationParams` ⭐

Hook especializado para paginación con búsqueda. **Incluye debounce automático** para el campo de búsqueda.

```tsx
import { usePaginationParams } from "@/app/(private)/hooks/useQueryParams";

const {
  search,           // Valor actual del input
  page,            // Página actual
  limit,           // Items por página
  debouncedSearch, // Valor con debounce para queries
  setSearch,       // Actualizar búsqueda (resetea a página 1)
  setPage,         // Cambiar página
  setLimit,        // Cambiar límite (resetea a página 1)
  reset,           // Resetear todo
} = usePaginationParams(300); // 300ms de debounce
```

#### API

```tsx
function usePaginationParams(debounceDelay?: number): {
  // Valores actuales
  search: string;
  page: number;
  limit: number;
  debouncedSearch: string;

  // Setters
  setSearch: (value: string) => void;
  setPage: (value: number) => void;
  setLimit: (value: number) => void;
  reset: () => void;

  // Utilidad
  updateParams: (updates: Partial<QueryParams>) => void;
}
```

**Parámetros:**
- `debounceDelay`: Tiempo de debounce para la búsqueda (default: 500ms)

#### Valores por Defecto

- `search`: `""` (string vacío)
- `page`: `1`
- `limit`: `10`

#### Comportamiento Automático

✅ **Debounce en búsqueda**: La búsqueda se actualiza en la URL después del delay
✅ **Reset de página**: Al cambiar search o limit, page vuelve a 1
✅ **Sincronización automática**: Lee y actualiza la URL automáticamente

#### Ejemplo Completo

```tsx
export default function ProductsPage() {
  const {
    search,
    page,
    limit,
    debouncedSearch, // ← Usar este en las queries
    setSearch,
    setPage,
    setLimit,
  } = usePaginationParams(300);

  // Usar debouncedSearch en la query, no search
  const { data, isLoading } = useQuery({
    queryKey: ["products", debouncedSearch, page, limit],
    queryFn: () =>
      fetchProducts({
        search: debouncedSearch, // ← Importante: usar debouncedSearch
        page,
        limit,
      }),
  });

  return (
    <div>
      {/* Input de búsqueda */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar..."
      />

      {/* Select de límite */}
      <select
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>

      {/* Paginación */}
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
      >
        Anterior
      </Button>

      <span>Página {page}</span>

      <Button onClick={() => setPage(page + 1)}>
        Siguiente
      </Button>
    </div>
  );
}
```

## Comparación: Antes vs Después

### ❌ Antes (sin hooks)

```tsx
export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);

  // Sincronizar con URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setPage(Number(searchParams.get("page")) || 1);
    setLimit(Number(searchParams.get("limit")) || 10);
  }, [searchParams]);

  // Función para actualizar URL
  const updateURL = (updates: any) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  // Query sin debounce
  const { data } = useQuery({
    queryKey: ["products", search, page, limit], // Se ejecuta en cada tecla
    queryFn: () => fetchProducts({ search, page, limit }),
  });

  return (
    <Input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        updateURL({ search: e.target.value, page: 1 });
      }}
    />
  );
}
```

### ✅ Después (con hooks)

```tsx
export default function ProductsPage() {
  const {
    search,
    page,
    limit,
    debouncedSearch,
    setSearch,
    setPage,
    setLimit,
  } = usePaginationParams(300);

  // Query con debounce automático
  const { data } = useQuery({
    queryKey: ["products", debouncedSearch, page, limit],
    queryFn: () => fetchProducts({
      search: debouncedSearch, // Solo se ejecuta después de 300ms
      page,
      limit,
    }),
  });

  return (
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)} // Simple!
    />
  );
}
```

## Ventajas

✅ **Menos código**: ~60% menos de código boilerplate
✅ **Debounce automático**: Optimiza requests a la API
✅ **Type-safe**: TypeScript completo
✅ **Sincronización automática**: URL ↔ Estado siempre en sync
✅ **Reutilizable**: Funciona en cualquier página
✅ **Performance**: Evita renders innecesarios
✅ **Reseteos inteligentes**: Automáticamente page → 1 al buscar

## Best Practices

### ✅ DO

```tsx
// Usar debouncedSearch en queries
const { debouncedSearch } = usePaginationParams();
useQuery({
  queryKey: ["products", debouncedSearch], // ✅ Correcto
  queryFn: () => fetch(debouncedSearch),
});

// Usar search en el input
<Input value={search} onChange={(e) => setSearch(e.target.value)} />

// Ajustar delay según necesidad
usePaginationParams(300); // Búsquedas rápidas
usePaginationParams(800); // Búsquedas pesadas
```

### ❌ DON'T

```tsx
// NO usar search en queries (sin debounce)
const { search } = usePaginationParams();
useQuery({
  queryKey: ["products", search], // ❌ Se ejecuta en cada tecla
  queryFn: () => fetch(search),
});

// NO usar debouncedSearch en el input (delay visible)
<Input value={debouncedSearch} /> // ❌ UX mala

// NO mezclar con useState manual
const [search, setSearch] = useState(""); // ❌ Duplicado
```

## Migración de Código Existente

### Paso 1: Importar el hook

```tsx
import { usePaginationParams } from "@/app/(private)/hooks/useQueryParams";
```

### Paso 2: Reemplazar estado local

```tsx
// ANTES ❌
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);

// DESPUÉS ✅
const { search, page, limit, debouncedSearch, setSearch, setPage, setLimit } =
  usePaginationParams();
```

### Paso 3: Actualizar query

```tsx
// ANTES ❌
queryKey: ["products", search, page, limit]

// DESPUÉS ✅
queryKey: ["products", debouncedSearch, page, limit]
```

### Paso 4: Simplificar onChange

```tsx
// ANTES ❌
onChange={(e) => {
  setSearch(e.target.value);
  updateURL({ search: e.target.value, page: 1 });
}}

// DESPUÉS ✅
onChange={(e) => setSearch(e.target.value)}
```

### Paso 5: Eliminar código innecesario

Eliminar:
- ❌ `useSearchParams()`
- ❌ `useRouter()`
- ❌ `usePathname()`
- ❌ Función `updateURL()`
- ❌ `useEffect` de sincronización

## Troubleshooting

**La búsqueda no se ejecuta inmediatamente:**
- ✅ Es el comportamiento esperado (debounce)
- Ajusta el delay si 500ms es mucho: `usePaginationParams(200)`

**Los parámetros no se sincronizan:**
- Verifica que uses `debouncedSearch` en la query
- Verifica que uses `search` en el input

**El debounce no funciona:**
- Asegúrate de usar `debouncedSearch` en `queryKey`
- No uses `search` directamente en la query

**Página no resetea al buscar:**
- ✅ Automático con `setSearch()`, no requiere código extra
