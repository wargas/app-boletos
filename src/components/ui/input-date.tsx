import { format, parse } from "date-fns"
import { isFunction, isString } from "lodash"
import { CalendarIcon } from "lucide-react"
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

const InputDate = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ onChange, ...props }, ref) => {

        // const [value, setValue] = useState(props?.value || '00')
        const [open, setOpen] = useState(false)

        const inputRef = useRef<HTMLInputElement>(null)

        

        const selectedData = useMemo(() => {
            if (isString(inputRef.current?.value)) {
                const _parsed = parse(inputRef.current.value, 'dd/MM/yyyy', new Date())
                if (isNaN(_parsed.getDate())) {
                    return new Date();
                }
                // closeRef.current?.click()
                return _parsed

            }
        }, [inputRef.current])

        const changeData = useCallback((day: Date | undefined, selectedDay: Date) => {
            if (day) {
                if(inputRef.current?.value) {
                    inputRef.current.value = format(String(day), 'dd/MM/yyyy')
                }
                const event = {
                    target: {
                        value: format(String(day), 'dd/MM/yyyy'),
                        name: props.name
                    } as unknown
                } as ChangeEvent<HTMLInputElement>

                if (onChange) {
                    onChange(event)
                }
                setOpen(false)
                return;
            }
            if(inputRef.current?.value) {
                inputRef.current.value = ''
            }

        }, [])

        function changeInput(event: ChangeEvent<HTMLInputElement>): void {
            
            if (onChange) {
                onChange(event)
            }
        }

        useEffect(() => {
            if(inputRef.current && isFunction(ref)) {
                ref(inputRef.current)
            }
        }, [inputRef.current])
      
        return (
            <div className="flex gap-1">
                <Input onChange={changeInput}  {...props} ref={inputRef}  />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button type='button' variant={'outline'} size={'icon'}><CalendarIcon /> </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end">
                        <Calendar
                            defaultMonth={selectedData}
                            required
                            onSelect={changeData}
                            selected={selectedData || new Date()}
                            mode='single' />
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)

InputDate.displayName = "InputDate"

export { InputDate }
