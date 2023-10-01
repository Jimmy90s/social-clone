/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { fetchByPath, validateField } from "./utils";
import { API } from "aws-amplify";
import { createVote } from "../graphql/mutations";
export default function VoteCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    vote: "",
    postID: "",
  };
  const [vote, setVote] = React.useState(initialValues.vote);
  const [postID, setPostID] = React.useState(initialValues.postID);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setVote(initialValues.vote);
    setPostID(initialValues.postID);
    setErrors({});
  };
  const validations = {
    vote: [{ type: "Required" }],
    postID: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          vote,
          postID,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await API.graphql({
            query: createVote,
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "VoteCreateForm")}
      {...rest}
    >
      <TextField
        label="Vote"
        isRequired={true}
        isReadOnly={false}
        value={vote}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              vote: value,
              postID,
            };
            const result = onChange(modelFields);
            value = result?.vote ?? value;
          }
          if (errors.vote?.hasError) {
            runValidationTasks("vote", value);
          }
          setVote(value);
        }}
        onBlur={() => runValidationTasks("vote", vote)}
        errorMessage={errors.vote?.errorMessage}
        hasError={errors.vote?.hasError}
        {...getOverrideProps(overrides, "vote")}
      ></TextField>
      <TextField
        label="Post id"
        isRequired={true}
        isReadOnly={false}
        value={postID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              vote,
              postID: value,
            };
            const result = onChange(modelFields);
            value = result?.postID ?? value;
          }
          if (errors.postID?.hasError) {
            runValidationTasks("postID", value);
          }
          setPostID(value);
        }}
        onBlur={() => runValidationTasks("postID", postID)}
        errorMessage={errors.postID?.errorMessage}
        hasError={errors.postID?.hasError}
        {...getOverrideProps(overrides, "postID")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
