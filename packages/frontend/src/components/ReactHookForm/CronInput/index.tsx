import { type AnyType } from '@lightdash/common';
import { Group } from '@mantine/core';
import {
    useCallback,
    useEffect,
    useState,
    type FC,
    type PropsWithChildren,
} from 'react';
import {
    Controller,
    useFormContext,
    type ControllerRenderProps,
    type FieldValues,
} from 'react-hook-form';
import CustomInputs from './CustomInputs';
import DailyInputs from './DailyInputs';
import FrequencySelect from './FrequencySelect';
import HourlyInputs from './HourlyInputs';
import MonthlyInputs from './MonthlyInputs';
import WeeklyInputs from './WeeklyInputs';
import {
    Frequency,
    getFrequencyCronExpression,
    mapCronExpressionToFrequency,
} from './cronInputUtils';

// TODO: this type is a bit of a mess because this component is used
// both in react-hook-form forms as well as mantine forms. If/when
// we move away from one of them, this should get simplified.
export const CronInternalInputs: FC<
    PropsWithChildren<
        {
            disabled: boolean | undefined;
            error?: string;
            errors?: {
                [x: string]: any;
            };
            onBlur?: () => void;
        } & Omit<ControllerRenderProps<FieldValues, string>, 'ref' | 'onBlur'>
    >
> = ({ value, disabled, onChange, name, error, errors, children }) => {
    const [frequency, setFrequency] = useState<Frequency>(
        mapCronExpressionToFrequency(value),
    );

    useEffect(() => {
        if (frequency !== Frequency.CUSTOM) {
            setFrequency(mapCronExpressionToFrequency(value));
        }
    }, [frequency, value]);

    const onFrequencyChange = useCallback(
        (newFrequency: Frequency) => {
            setFrequency(newFrequency);
            onChange(getFrequencyCronExpression(newFrequency, value));
        },
        [onChange, value],
    );

    return (
        <Group spacing="sm" align="flex-start">
            <FrequencySelect
                value={frequency}
                disabled={disabled}
                onChange={onFrequencyChange}
            />
            {frequency === Frequency.HOURLY && (
                <HourlyInputs cronExpression={value} onChange={onChange} />
            )}
            {frequency === Frequency.DAILY && (
                <DailyInputs cronExpression={value} onChange={onChange} />
            )}
            {frequency === Frequency.WEEKLY && (
                <WeeklyInputs cronExpression={value} onChange={onChange} />
            )}
            {frequency === Frequency.MONTHLY && (
                <MonthlyInputs cronExpression={value} onChange={onChange} />
            )}
            {frequency === Frequency.CUSTOM && (
                <CustomInputs
                    name={name}
                    cronExpression={value}
                    onChange={onChange}
                    errors={errors}
                    error={error}
                />
            )}
            {children}
        </Group>
    );
};

const CronInput: FC<{
    disabled?: boolean;
    rules?: React.ComponentProps<typeof Controller>['rules'];
    name: string;
    defaultValue?: AnyType;
}> = ({ name, rules, defaultValue, disabled }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            render={({ field }) => (
                <CronInternalInputs
                    disabled={disabled}
                    {...field}
                    errors={errors}
                />
            )}
        />
    );
};

export default CronInput;
