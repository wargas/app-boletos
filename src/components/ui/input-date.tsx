import { format, parse } from "date-fns"
import { isString } from "lodash"
import { CalendarIcon } from "lucide-react"
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

const InputDate = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ onChange, ...props }, ref) => {

        const [value, setValue] = useState(props.value || '')
        const [open, setOpen] = useState(false)


        const selectedData = useMemo(() => {
            if (isString(value)) {
                const _parsed = parse(value, 'dd/MM/yyyy', new Date())
                if (isNaN(_parsed.getDate())) {
                    return new Date();
                }
                // closeRef.current?.click()
                return _parsed

            }
        }, [value])

        const changeData = useCallback((day: Date | undefined, selectedDay: Date) => {
            if (day) {
                setValue(format(String(day), 'dd/MM/yyyy'))


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
            setValue('')

        }, [])

        function changeInput(event: ChangeEvent<HTMLInputElement>): void {
            setValue(event.target.value)

            if (onChange) {
                onChange(event)
            }
        }

        useEffect(() => {
            if (props?.value) {
                setValue(props.value)
            }

        }, [props.value])

        return (
            <div className="flex gap-1">
                <Input onChange={changeInput} value={value} ref={ref} {...props} />
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
