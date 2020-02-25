import React from 'react'
import { withFormik, FormikProps, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import HeadMeta from '../../utils/HeadMeta';
import Section from '../../utils/Section';
import { Button, Icon } from 'antd';
import { PostId } from 'src/components/types';
import TagsInput from '../tags-input/TagsInput';
import SimpleMDEReact from 'react-simplemde-editor';
import './NavigationEditor.css'

// Shape of form values
export interface PartialPost { id: PostId, title: string }

interface FilterByTags {
  tags: string[]
}

interface SpecificPost {
  postId: PostId
}

interface OuterUrl {
  url: string
}

type NavTabContent = FilterByTags | SpecificPost | OuterUrl

export interface NavTab {
  id: number
  title: string
  content: NavTabContent
  description: string
  hidden: boolean
  type: string
}

export interface FormValues {
  navTabs: NavTab[]
}

interface OtherProps {
  tagsData: string[]
  posts: PartialPost[]
  typesOfContent: string[]
}

const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  const {
    values,
    //posts,
    errors,
    touched,
    setFieldValue,
    typesOfContent,
    tagsData
  } = props;

  const {
    navTabs,
  } = values;

  const getMaxId = ():number => {
    const x = navTabs.reduce((cur, prev) => (cur.id > prev.id ? cur : prev))
    return x.id
  }

  const defaultTab = { id: getMaxId() + 1, title: '', type: 'by-tag', description: '', content: { tags: [] }, hidden: false, }

  const renderValueField = (nt: NavTab, index: number) => {
    let url = nt.content.url ? nt.content.url : ''
    let postId = nt.content.postId ? nt.content.postId.toString() : ''

    switch (nt.type){
      case 'ext-url': {
        return (
          <Field
            type="text"
            name={`nt.${index}.content.url`}
            value={url}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setFieldValue(`navTabs.${index}.content.url`, e.currentTarget.value)}
          />
        )
      }
      case 'blog-url': {
        return (
          <Field
            type="text"
            name={`nt.${index}.content.postId`}
            value={postId}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setFieldValue(`navTabs.${index}.content.postId`, e.currentTarget.value)}
          />
        )

      }
      case 'by-tag': {
        return (
          <div className="NETagsWrapper">
            <TagsInput
              currentTab={index}
              tagsData={tagsData}
              {...props}
            />
          </div>
        )
      }
      default: {
        return undefined
      }
    } 
  }

  console.log('errors', errors)
  console.log('touched', touched)

  const renderError = (index: number, name: string) => {
    if (errors.navTabs && errors.navTabs[index]?.title && name === 'title') {
      return <div className='ui pointing red label NEErrorMessage' >{ errors.navTabs[index]?.title } </div>
    }
    return null
  } 

  return <>
    <HeadMeta title={'Navigation Editor'} />
    <Section className='NavigationEditor' title={'Navigation Editor'}>
      <Form className='ui form DfForm NavigationEditorForm'>
        <FieldArray
          name="navTabs"
          render={arrayHelpers => (
            <div>
              {values.navTabs && values.navTabs.length > 0 && (
                values.navTabs.map((nt, index) => (
                  <div className={`NERow ${(nt.hidden ? 'NEHidden' : '')}`} key={nt.id}>
                    
                    <div className="NEText">Name:</div>
                    <Field
                      type="text"
                      name={`nt.${index}.title`}
                      placeholder="Tab Name"
                      value={nt.title}
                      onChange={(e: React.FormEvent<HTMLInputElement>) => setFieldValue(`navTabs.${index}.title`, e.currentTarget.value)}
                    />
                    { renderError(index, 'title') }
                    <div className="NEText">Description:</div>
                    <Field 
                      component={SimpleMDEReact} 
                      name={`navTabs.${index}.description`} value={nt.description} 
                      onChange={(data: string) => setFieldValue(`navTabs.${index}.description`, data)} 
                      className={`DfMdEditor NETextEditor`} />
                    <div className="NEText">Type of content:</div>
                    <Field 
                      component="select" 
                      name={`nt.${index}.type`} 
                      defaultValue={nt.type}
                      onChange={(e: React.FormEvent<HTMLInputElement>) => setFieldValue(`navTabs.${index}.type`, e.currentTarget.value)}
                    >
                      {
                        typesOfContent.map((x) => <option key={x} value={x} >{x}</option>)
                      }
                    </Field>
                    <div className="NEText">Value:</div>
                    {
                      renderValueField(nt, index)
                    }
                    <div className="NEButtonsWrapper">
                      <div className="NEHideButton">
                        <Icon
                          type="eye-invisible"
                          onClick={() => setFieldValue(`navTabs.${index}.hidden`, nt.hidden)}
                        />
                      </div>
                      <div className="NERemoveButton">
                        <Icon
                          type="delete"
                          onClick={() => arrayHelpers.remove(index)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="NERow">
                <div
                  className="NEAddTab"
                  onClick={() => { arrayHelpers.push(defaultTab) }}
                >
                  + Add Tab
                </div>
              </div>
            </div>
          )}
        />

        <Button type="primary" htmlType="submit" disabled={false} className={'NESubmit'}>
          Save
        </Button>
      </Form>

    </Section>
  </>
}

// Validation
//const TITLE_REGEX = /^[A-Za-z0-9_-]+$/;
const TITLE_MIN_LEN = 2;
const TITLE_MAX_LEN = 50;

const schema = Yup.object().shape({
  navTabs: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string()
          .min(TITLE_MIN_LEN, 'too short')
          .max(TITLE_MAX_LEN, 'too long')
          .required('Required message') // these constraints take precedence
      })
    )
});

// The type of props MyForm receives
export interface NavEditorFormProps {
  tagsData: string[]
  posts: PartialPost[]
  navTabs: NavTab[]
  typesOfContent: string[]
}

// Wrap our form with the withFormik HoC
const NavigationEditor = withFormik<NavEditorFormProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: props => {
    return {
      navTabs: props.navTabs,
    };
  },

  validationSchema: schema,

  handleSubmit: values => {
    console.log(values)
  },
})(InnerForm);


export default NavigationEditor
