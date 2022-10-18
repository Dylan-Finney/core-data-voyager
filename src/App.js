import logo from './logo.svg';
import './App.css';
import {getIntrospectionQuery,buildSchema, graphqlSync, GraphQLString, buildClientSchema, printSchema,buildASTSchema,parse } from "graphql"
import { useState, useEffect,memo } from 'react';
import { useToast,Flex, Container, Button, Link, Select, Spacer } from '@chakra-ui/react'
import { init, Voyager,GraphQLVoyager } from 'graphql-voyager';
import Todos from "./Test"
const axios = require('axios').default;
var _ = require('lodash');
// const fs = require("fs")
// require("dotenv").config();
const API_URL = "https://api-eu-west-2.hygraph.com/v2/cl92tdav3367601t6dp65an90/master"


function App() {
  const toast = useToast()
  const [url, setUrl] = useState("")
  const [option, setOption] = useState([])
  const [introspection, setIntrospection] = useState({})
  const [test, setTest] = useState(false)
  const [voyagerData, setVoyagerData] = useState({})

  const handleChange = event => {    
    event.preventDefault();
    setUrl(event.target.value);  
  }
  const handleSelectChange = event => {    
    event.preventDefault();
    setOption(event.target.value);  
  }
  const handleClipboardSubmit = async (event) => {
    event.preventDefault();
    try{
      let result
      if (url === ""){
        result  = await axios.post(API_URL,{
          query: getIntrospectionQuery()
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        result  = await axios.post(url,{
          query: getIntrospectionQuery()
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    console.log(result)
    let sdlString
    // switch (option){
    //   case "full":
    //     const graphqlSchemaObj2 = buildClientSchema(result.data.data);
    //     // console.log(result2)
    //     // const graphqlSchemaObj = buildClientSchema(result2);
    //     sdlString = printSchema(graphqlSchemaObj2);
    //     break
    //   default:
    //     result = result.data.data.__schema.types
    //     console.log(result)
    //     let schema = result.filter(obj => obj.kind==="OBJECT"||obj.kind==="SCALAR")
    //     schema = schema.filter(obj => !["Aggregate",
    //     "Asset",
    //     "AssetConnection",
    //     "AssetEdge",
    //     "BatchPayload",
    //     "Color",
    //     "DocumentVersion",
    //     "Location",
    //     "Mutation",
    //     "PageInfo",
    //     "RGBA",
    //     "RichText",
    //     "ScheduledOperation",
    //     "ScheduledOperationConnection",
    //     "ScheduledOperationEdge",
    //     "ScheduledRelease",
    //     "ScheduledReleaseConnection",
    //     "ScheduledReleaseEdge",
    //     "Query",
    //     "User",
    //     "UserConnection",
    //     "UserEdge",
    //     "Version"
    //     ].includes(obj.name))
    //     schema = schema.filter(obj => !(obj.name.endsWith("Connection")||obj.name.endsWith("Edge")))
    //     let q1Type;
    //     let important = []
    //     for (var i = 0; i < schema.length; i++){
    //       for (var x = 0; x < schema[i].interfaces.length; x++){
    //         switch(schema[i].interfaces[x].name){
    //           case "Node":
    //             important.push(schema[i].name)
    //             break
    //           default:
    //             break;
    //         }
    //       } 
    //       schema[i].interfaces = schema[i].interfaces.filter(obj => {
    //         switch(obj.name){
    //           case "Node":
    //             return false
    //           default:
    //             break;
    //         }
    //         return true
    //       }) 
    //       schema[i].fields = schema[i].fields.filter(obj => {
    //         switch(obj.name){
    //           case "stage":
    //           case "documentInStages":
    //           case "publishedAt":
    //           case "updatedAt":
    //           case "createdAt":
    //           case "id":
    //           case "publishedBy":
    //           case "updatedBy":
    //           case "createdBy":
    //           case "scheduledIn":
    //           case "history":
    //             return false
    //           default:
    //             break;
    //         }
    //         return true
    //       })
    //       for (var x = 0; x < schema[i].fields.length; x++){
    //         if (schema[i].fields[x].args.length > 0){
    //           console.log("x", schema[i].fields[x].args)
    //           schema[i].fields[x].args = schema[i].fields[x].args.filter(obj => {
    //             console.log("x", obj);
    //             switch(obj.name){
    //               case "locales":
    //               case "where":
    //               case "orderBy":
    //               case "skip":
    //               case "after":
    //               case "before":
    //               case "first":
    //               case "last":
    //                 return false
    //               default:
    //                 break;
    //             }
    //             return true
    //           })
    //         }
    //         if (schema[i].fields[x].type.name === "String"){
    //           schema[i].fields[x].type = GraphQLString
    //         }
    //       } 
    //     }
    //     console.log(schema)
    //     console.log(important)
    //     let query = {
    //       description: "The data objects that can be called for",
    //       enunValues: [],
    //       fields: [],
    //       inputFields: [],
    //       interfaces: [],
    //       kind: "OBJECT",
    //       name: "Query",
    //       possibleTypes: [],

    //     }
    //     for (var i =0; i<important.length;i++){
    //       query.fields.push({
    //         args: [],
    //         deprecationReason: null,
    //         description: "",
    //         isDeprecated: false,
    //         name: important[i].toLowerCase(),
    //         type: {
    //           kind: "OBJECT",
    //           name: important[i],
    //           ofType: null,
    //         },
    //       })
    //     }
    //     schema.push(query)
    //     const graphqlSchemaObj = buildClientSchema({__schema:{
    //       directives: [],
    //       mutationType: null,
    //       queryType: {
    //         name: "Query"
    //       },
    //       subscriptionType: null,
    //       types: schema,
    //     }});
    //     sdlString = printSchema(graphqlSchemaObj);
    //     break
    // }
    switch (option){
      case "full":
        const graphqlSchemaObj2 = buildClientSchema(result.data.data);
        // console.log(result2)
        // const graphqlSchemaObj = buildClientSchema(result2);
        sdlString = printSchema(graphqlSchemaObj2);
        break
      default:
        result = result.data.data.__schema.types
        console.log(result)
        let schema = result.filter(obj => obj.kind==="OBJECT"||obj.kind==="SCALAR"||obj.kind==="ENUM")
        schema = schema.filter(obj => !["Aggregate",
        "Asset",
        "AssetConnection",
        "AssetEdge",
        "BatchPayload",
        "Color",
        "DocumentVersion",
        "Location",
        "Mutation",
        "PageInfo",
        "RGBA",
        "RichText",
        "ScheduledOperation",
        "ScheduledOperationConnection",
        "ScheduledOperationEdge",
        "ScheduledRelease",
        "ScheduledReleaseConnection",
        "ScheduledReleaseEdge",
        "Query",
        "User",
        "UserConnection",
        "UserEdge",
        "Version"
        ].includes(obj.name))
        schema = schema.filter(obj => !(obj.name.endsWith("Connection")||
        obj.name.endsWith("Edge")||
        obj.name.endsWith("OrderByInput")))
        schema = schema.filter(obj => {
            if (!obj.kind==="ENUM"){
                return true
            } else {
                if (["DocumentFileTypes",
                "ImageFit",
                "Locale",
                "ScheduledOperationStatus",
                "ScheduledReleaseStatus",
                "Stage",
                "SystemDateTimeFieldVariation",
                "UserKind",
                "_FilterKind",
                "_MutationInputFieldKind",
                "_MutationKind",
                "_OrderDirection",
                "_RelationInputCardinality",
                "_RelationInputKind",
                "_RelationKind",
                "_SystemDateTimeFieldVariation"
            ].includes(obj.name)){
                    return false
                } else {
                    return true
                }
            }
        })
        console.log("TEST HERE",schema)
        let important = []
        for (var i = 0; i < schema.length; i++){
          for (var x = 0; x < schema[i].interfaces.length; x++){
            switch(schema[i].interfaces[x].name){
              case "Node":
                important.push(schema[i].name)
                break
              default:
                break;
            }
          } 
          schema[i].interfaces = schema[i].interfaces.filter(obj => {
            switch(obj.name){
              case "Node":
                return false
              default:
                break;
            }
            return true
          }) 
          schema[i].fields = schema[i].fields.filter(obj => {
            switch(obj.name){
              case "stage":
              case "documentInStages":
              case "publishedAt":
              case "updatedAt":
              case "createdAt":
              case "id":
              case "publishedBy":
              case "updatedBy":
              case "createdBy":
              case "scheduledIn":
              case "history":
                return false
              default:
                break;
            }
            return true
          })
          for (var x = 0; x < schema[i].fields.length; x++){
            if (schema[i].fields[x].args.length > 0){
              console.log("x", schema[i].fields[x].args)
              schema[i].fields[x].args = schema[i].fields[x].args.filter(obj => {
                console.log("x", obj);
                switch(obj.name){
                  case "locales":
                  case "where":
                  case "orderBy":
                  case "skip":
                  case "after":
                  case "before":
                  case "first":
                  case "last":
                    return false
                  default:
                    break;
                }
                return true
              })
            }
            if (schema[i].fields[x].type.name === "String"){
              schema[i].fields[x].type = GraphQLString
            }
          } 
        }
        console.log("TEST HERE 2",schema)
        console.log(important)
        let query = {
          description: "The data objects that can be called for",
          enunValues: [],
          fields: [],
          inputFields: [],
          interfaces: [],
          kind: "OBJECT",
          name: "Query",
          possibleTypes: [],

        }
        for (var i =0; i<important.length;i++){
          query.fields.push({
            args: [],
            deprecationReason: null,
            description: "",
            isDeprecated: false,
            name: important[i].toLowerCase(),
            type: {
              kind: "OBJECT",
              name: important[i],
              ofType: null,
            },
          })
        }
        schema.push(query)
        const graphqlSchemaObj = buildClientSchema({__schema:{
          directives: [],
          mutationType: null,
          queryType: {
            name: "Query"
          },
          subscriptionType: null,
          types: schema,
        }});
        console.log(printSchema(buildASTSchema(parse(printSchema(graphqlSchemaObj)))))
        sdlString = printSchema(graphqlSchemaObj);;
    }
    console.log(sdlString.replace("​", ""))
    navigator.clipboard.writeText(sdlString.replace("​", ""))
    toast({
      title: 'SDL Schema Success.',
      description: "SDL Schema Created & Copied to Cliboard.",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
    } catch (e) {
      console.log(e)
      switch(e.name){
        case "AxiosError":
          toast({
            title: 'API Error.',
            description: "Error Fetching Data From API",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          break
        default:
          toast({
            title: 'SDL Schema Failure.',
            description: "Error in process. See Console for more details",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          break
      }
      
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setVoyagerData({
      url: url,
      filter: option,
      git: false
    })
  }
  const handleGithubSubmit = (event) => {
    event.preventDefault()
    setVoyagerData({
      url: "https://raw.githubusercontent.com/Dylan-Finney/core-data-model/main/core-data-model.graphql",
      filter: option,
      git: true
    })
  }
  const handleDifferences = async (event) => {
    event.preventDefault()
    await axios.post(API_URL,{
      query: getIntrospectionQuery()
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (urlRepsonse)=>{
      await axios.get('https://raw.githubusercontent.com/Dylan-Finney/core-data-model/main/core-data-model.graphql').then((gitRepsonse)=>{
        console.log("1",urlRepsonse)
        console.log("2",gitRepsonse)
        var gitSchema = buildSchema(gitRepsonse.data);
        var  gitResult = graphqlSync({schema: gitSchema, source: getIntrospectionQuery()});
        console.log("gitSchema",gitSchema)
        let result = urlRepsonse.data.data.__schema.types
        console.log(result)
        let schema = result.filter(obj => obj.kind==="OBJECT"||obj.kind==="SCALAR"||obj.kind==="ENUM")
        schema = schema.filter(obj => !["Aggregate",
        "Asset",
        "AssetConnection",
        "AssetEdge",
        "BatchPayload",
        "Color",
        "DocumentVersion",
        "Location",
        "Mutation",
        "PageInfo",
        "RGBA",
        "RichText",
        "ScheduledOperation",
        "ScheduledOperationConnection",
        "ScheduledOperationEdge",
        "ScheduledRelease",
        "ScheduledReleaseConnection",
        "ScheduledReleaseEdge",
        "Query",
        "User",
        "UserConnection",
        "UserEdge",
        "Version"
        ].includes(obj.name))
        schema = schema.filter(obj => !(obj.name.endsWith("Connection")||
        obj.name.endsWith("Edge")||
        obj.name.endsWith("OrderByInput")))
        schema = schema.filter(obj => {
            if (!obj.kind==="ENUM"){
                return true
            } else {
                if (["DocumentFileTypes",
                "ImageFit",
                "Locale",
                "ScheduledOperationStatus",
                "ScheduledReleaseStatus",
                "Stage",
                "SystemDateTimeFieldVariation",
                "UserKind",
                "_FilterKind",
                "_MutationInputFieldKind",
                "_MutationKind",
                "_OrderDirection",
                "_RelationInputCardinality",
                "_RelationInputKind",
                "_RelationKind",
                "_SystemDateTimeFieldVariation"
            ].includes(obj.name)){
                    return false
                } else {
                    return true
                }
            }
        })
        let important = []
        for (var i = 0; i < schema.length; i++){
          for (var x = 0; x < schema[i].interfaces.length; x++){
            switch(schema[i].interfaces[x].name){
              case "Node":
                important.push(schema[i].name)
                break
              default:
                break;
            }
          } 
          schema[i].interfaces = schema[i].interfaces.filter(obj => {
            switch(obj.name){
              case "Node":
                return false
              default:
                break;
            }
            return true
          }) 
          schema[i].fields = schema[i].fields.filter(obj => {
            switch(obj.name){
              case "stage":
              case "documentInStages":
              case "publishedAt":
              case "updatedAt":
              case "createdAt":
              case "id":
              case "publishedBy":
              case "updatedBy":
              case "createdBy":
              case "scheduledIn":
              case "history":
                return false
              default:
                break;
            }
            return true
          })
          for (var x = 0; x < schema[i].fields.length; x++){
            if (schema[i].fields[x].args.length > 0){
              console.log("x", schema[i].fields[x].args)
              schema[i].fields[x].args = schema[i].fields[x].args.filter(obj => {
                console.log("x", obj);
                switch(obj.name){
                  case "locales":
                  case "where":
                  case "orderBy":
                  case "skip":
                  case "after":
                  case "before":
                  case "first":
                  case "last":
                    return false
                  default:
                    break;
                }
                return true
              })
            }
            // if (schema[i].fields[x].type.name === "String"){
            //   schema[i].fields[x].type = GraphQLString
            // }
          } 
        }
        console.log(schema)
        console.log(important)
        let query = {
          description: "The data objects that can be called for",
          enumValues: [],
          fields: [],
          inputFields: [],
          interfaces: [],
          kind: "OBJECT",
          name: "Query",
          possibleTypes: [],

        }
        for (var i =0; i<important.length;i++){
          query.fields.push({
            args: [],
            deprecationReason: null,
            description: "",
            isDeprecated: false,
            name: important[i].toLowerCase(),
            type: {
              kind: "OBJECT",
              name: important[i],
              ofType: null,
            },
          })
        }
        schema.push(query)
        let urlSchema = {
          data: {__schema:{
              directives: [],
              mutationType: null,
              queryType: {
                name: "Query"
              },
              subscriptionType: null,
              types: schema,
            }}
      }
      console.log("schema",urlSchema)

      console.log("gitResult", gitResult)
      

      let urlTypesBase = urlSchema.data.__schema.types
      let urlTypesFiltered = urlSchema.data.__schema.types

      let gitTypesBase = gitResult.data.__schema.types
      let gitTypesFiltered = gitResult.data.__schema.types

      //Compare url against git
      // urlTypesFiltered.filter(type=>{
      //   let found = false
        // for (var i = 0; gitTypesFiltered.length; i++){
        //   if (JSON.stringify(type)===JSON.stringify(gitTypesFiltered[i])){
        //     found = true
        //     break
        //   }
        // }
      //   return found
      let found = false
      // for (var i = 0; gitTypesFiltered.length; i++){
      //   if (_.isEqual(urlTypesFiltered[0], gitTypesFiltered[i])){
      //     found = true
      //     break
      //   }
      // }
      // console.log(found)

      for (var i = 0; i< urlTypesFiltered.length; i++){
        // console.log(urlTypesFiltered[i])
        //enumValues
        // if (!urlTypesFiltered[i].enumValues === null){
          // console.log("YEAH",urlTypesFiltered[i])
          if (urlTypesFiltered[i].enumValues.length === 0){
            urlTypesFiltered[i].enumValues = null
          }
        // } else {
          // console.log("NO",urlTypesFiltered[i])

        // }
        //fields
        // if (!urlTypesFiltered[i].fields === null){
          if (urlTypesFiltered[i].fields.length === 0){
            urlTypesFiltered[i].fields = null
          }
        // }
        //inputFields
        // if (!urlTypesFiltered[i].inputFields === null){
          if (urlTypesFiltered[i].inputFields.length === 0){
            urlTypesFiltered[i].inputFields = null
          }
        // }
        //interfaces
        // if (!urlTypesFiltered[i].interfaces === null){
          if (urlTypesFiltered[i].interfaces.length === 0){
            urlTypesFiltered[i].interfaces = null
          }

          if (urlTypesFiltered[i].possibleTypes.length === 0){
            urlTypesFiltered[i].possibleTypes = null
          }
        // }

      }
      for (var i = 0; i< gitTypesFiltered.length; i++){
        //enumValues
        // console.log(gitTypesFiltered[i])
        if (!gitTypesFiltered[i].enumValues === null){
          if (gitTypesFiltered[i].enumValues.length === 0){
            gitTypesFiltered[i].enumValues = null
          }
        }
        //fields
        if (!gitTypesFiltered[i].fields === null){
          if (gitTypesFiltered[i].fields.length === 0){
            gitTypesFiltered[i].fields = null
          }
        }
        //inputFields
        if (!gitTypesFiltered[i].inputFields === null){
          if (gitTypesFiltered[i].inputFields.length === 0){
            gitTypesFiltered[i].inputFields = null
          }
        }
        //interfaces
        // if (!gitTypesFiltered[i].interfaces === null){
          console.log(gitTypesFiltered[i].interfaces === null)

          if (gitTypesFiltered[i].interfaces){
            console.log("YEAH",gitTypesFiltered[i])
            if (gitTypesFiltered[i].interfaces.length === 0){
              gitTypesFiltered[i].interfaces = null
            }
          } else {
            console.log("NO",gitTypesFiltered[i])
          }
        // }

      }
      gitTypesFiltered = gitTypesFiltered.filter(obj => !(obj.name==="Query"||obj.name==="__Schema"||obj.name==="__Type"||obj.name==="__TypeKind"||obj.name==="__Field"||obj.name==="__InputValue"||obj.name==="__EnumValue"||obj.name==="__Directive"||obj.name==="__DirectiveLocation"))
      console.log("url",urlTypesFiltered)
      console.log("git",gitTypesFiltered)
      console.table(urlTypesFiltered);
      console.table(gitTypesFiltered);
      console.log(urlTypesFiltered[14])
      console.log(gitTypesFiltered[14])
      console.log(urlTypesFiltered.length)
      console.log(_.isEqual(urlTypesFiltered[14], gitTypesFiltered[14]))

      // console.log(_.isEqual(urlTypesFiltered[8], gitTypesFiltered[3]))


      urlTypesFiltered = urlTypesFiltered.filter((obj)=>{
        if (obj.name==="String"||obj.name==="ID"||obj.name==="Float"||obj.name==="Query") return false
        for (var gitIndex = 0; gitIndex< gitTypesFiltered.length; gitIndex++){
          if (_.isEqual(obj, gitTypesFiltered[gitIndex])){
            console.log("YEAH")
            return false
          } 

        }
        return true
      })
      // for (var urlIndex = 0; urlIndex< urlTypesFiltered.length; urlIndex++){
      //   // console.log(urlIndex)
      //   for (var gitIndex = 0; gitIndex< gitTypesFiltered.length; gitIndex++){
      //     if (_.isEqual(urlTypesFiltered[urlIndex], gitTypesFiltered[gitIndex])){
      //       console.log("YEAH")
      //       urlTypesFiltered.splice(urlIndex, 1);
      //       break
      //     } 

      //   }
      // }
      console.table(urlTypesFiltered)
      toast({
        title: 'Differences Found.',
        description: "Check the console to see any and all differences between API and Github Schemas.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

      // })

      
      //Compare git againsdt url

      })
    })
  }
  return (
    <div className="App">
      <Flex direction="column">
        <Flex direction="column" background="gray.100" p={12} rounded={6} >
        <form onSubmit={handleSubmit}>        
          <Flex direction="column">
          <label>
            URL:
            <input type="text" value={url} onChange={handleChange} />        </label>
            <Select placeholder='Select option' onChange={handleSelectChange}>
              <option value='full'>Full</option>
              <option value='basic'>Basic</option>
            </Select>
          <Flex direction="row">
            <Spacer/>
            <Button type='submit' colorScheme="teal">Visualise</Button>
            
            <Button colorScheme="teal" onClick={handleClipboardSubmit}>Copy to Cliboard</Button>
            <Button colorScheme="teal" onClick={handleGithubSubmit}>Use GitHub Schema</Button>
            <Button colorScheme="teal" onClick={handleDifferences}>Differences</Button>


            <Spacer/>
          </Flex>
          </Flex>
        </form>
        <p><Link href="https://ivangoncharov.github.io/graphql-voyager/" isExternal>GraphQl Voyager</Link></p>
        </Flex>
        <Todos data={voyagerData}/>
      </Flex>



    </div>
  );
}

export default App;
