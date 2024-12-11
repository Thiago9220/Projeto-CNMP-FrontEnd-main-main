import { Tr, Td, Text, Tooltip, Input, IconButton, Stack } from '@chakra-ui/react';
import { InfoIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';

const MonthlyTableRow = ({
  label,
  type,
  formData,
  handleInputChange,
  valorCalculado,
  openEditModal,
  openViewModal,
  selectedIndicator,
  meta,
  setMeta,
  months,
  currentMonth
}) => (
  <Tr>
    {type === 'prescrito' && (
      <Td
        rowSpan="4"
        p="1"
        textAlign="center"
        border="1px solid"
        borderColor="gray.300"
      >
        <Text fontWeight="bold">
          {selectedIndicator || 'Selecione um Indicador'}
        </Text>
      </Td>
    )}
    <Td p="1" textAlign="left" border="1px solid" borderColor="gray.300">
      <Tooltip label={`Informações sobre ${label}`} aria-label="Tooltip">
        <Text>
          <InfoIcon mr="2" />
          {label}
        </Text>
      </Tooltip>
    </Td>
    {months.map((month, index) => (
      <Td
        key={`${type}-${index}`}
        textAlign="center"
        p="1"
        border="1px solid"
        borderColor="gray.300"
        bgColor={index === currentMonth ? 'gray.200' : 'white'}
        fontWeight={index === currentMonth ? 'medium' : 'normal'}
      >
        {type === 'calculado' ? (
          <Text>{valorCalculado[index].toFixed(2)}%</Text>
        ) : type === 'analise' ? (
          <Stack direction="row" spacing={2} justify="center" align="center">
            <IconButton
              size="xs"
              icon={<EditIcon />}
              aria-label="Editar Análise"
              onClick={() => openEditModal(index)}
              isDisabled={index >= currentMonth}
            />
            <IconButton
              size="xs"
              icon={<ViewIcon />}
              aria-label="Visualizar Análise"
              onClick={() => openViewModal(index)}
              isDisabled={!formData.analiseMensal[index]}
            />
          </Stack>
        ) : (
          <Input
            size="sm"
            variant="outline"
            textAlign="center"
            value={formData[type][index]}
            onChange={(e) => handleInputChange(type, index, e.target.value)}
            placeholder="0,00"
            isDisabled={index >= currentMonth}
          />
        )}
      </Td>
    ))}
    {type === 'prescrito' && (
      <Td
        rowSpan="4"
        p="1"
        textAlign="center"
        border="1px solid"
        borderColor="gray.300"
      >
        <Input
          size="sm"
          variant="outline"
          textAlign="center"
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
        />
      </Td>
    )}
  </Tr>
);

export default MonthlyTableRow;
