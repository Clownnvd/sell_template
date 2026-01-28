export function LogosSection() {
  return (
    <section className="border-y border-border bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <p className="text-center text-sm text-muted-foreground">
          Trusted by teams building modern products
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {["Acme", "North", "Vertex", "Keystone", "Sapphire", "Monarch"].map(
            (name) => (
              <div
                key={name}
                className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-muted-foreground"
              >
                {name}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
