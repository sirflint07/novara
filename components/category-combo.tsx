"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface CategoryProps {
  options: { value: string | null, label: string }[],
  value: string | null,
  onChange: (value: string | null) => void
}

export function CategoryDropdown({ options, value, onChange }: CategoryProps) {
  
  const selectedLabel = options.find(opt => opt.value === value)?.label || ""

  return (
    <Combobox 
      items={options} 
      value={value ?? ""}
      onValueChange={(newValue) => onChange(newValue || null)}
    >
     
      <ComboboxInput 
        placeholder="Select a category" 
        showClear 
        value={selectedLabel}
      />
      <ComboboxContent>
        <ComboboxEmpty>No categories found.</ComboboxEmpty>
        <ComboboxList>
          {options.map((option, i) => (
            <ComboboxItem key={i} value={option.value || ""}>
              {option.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}