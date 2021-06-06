/** @jsx jsx */
import { React, AllWidgetProps, jsx, DataSourceComponent, SqlQueryParams, DataSourceManager, QueriableDataSource, DataSource } from 'jimu-core';
import defaultMessages from './translation/default';
import { Label, Radio, defaultMessages as jimuUIMessages } from 'jimu-ui';

interface State {
  streamTemp: StreamTemp

}

enum StreamTemp {
  Warm = 'Warm',
  Cool = 'Cool',
  Cold = 'Cold',
  Unknown = 'Unknown',
  None = 'None'
}

export default class Widget extends React.PureComponent<AllWidgetProps<unknown>, State> {
  constructor (props) {
    super(props)

    this.state = {
      streamTemp: StreamTemp.None
    }
  }

  componentWillUnmount () {
    const dataSourceId = this.props.useDataSources?.[0]?.dataSourceId
    const dataSource = dataSourceId && DataSourceManager.getInstance().getDataSource(dataSourceId) as QueriableDataSource
    if (dataSource) {
      // Reset query in data source
      dataSource.updateQueryParams(this.getQuery(StreamTemp.None), this.props.id)
    }
  }

  getQuery = (streamTemp: StreamTemp): SqlQueryParams => {
    return {
      where: this.getFilter(streamTemp)
    }
  }

  getFilter = (streamTemp: StreamTemp): string => {
    if (streamTemp && streamTemp!== StreamTemp.None) {
      return `(REGIME = '${streamTemp}')`
    }

    return '(1=1)'
  }

  onRadioButtonChange = e => {
    const streamTemp = e.target.value
    // Update radio button selected status
    this.setState({ streamTemp })

    const dataSourceId = this.props.useDataSources?.[0]?.dataSourceId
    const dataSource = dataSourceId && DataSourceManager.getInstance().getDataSource(dataSourceId) as QueriableDataSource
    if (dataSource) {
      // Update query in data source
      dataSource.updateQueryParams(this.getQuery(streamTemp), this.props.id)
    }
  }

  onDataSourceCreated = (ds: DataSource) => {
    if (this.state.streamTemp && ds) {
      const dataSource = ds as QueriableDataSource
      // Update query in data source
      dataSource.updateQueryParams(this.getQuery(this.state.streamTemp), this.props.id)
    }
  }

  render () {
    return (
      <div className='widget-demo jimu-widget m-2'>
        <DataSourceComponent // Create data source which is use by current widget
          useDataSource={this.props.useDataSources?.[0]}
          widgetId={this.props.id}
          onDataSourceCreated={this.onDataSourceCreated}
        />
        <div>
          <b>{this.props.intl.formatMessage({ id: 'selectPolicy', defaultMessage: defaultMessages.selectPolicy })}</b><br />
          <Label style={{ cursor: 'pointer' }}>
            <Radio
              style={{ cursor: 'pointer' }} value={StreamTemp.None} checked={this.state.streamTemp === StreamTemp.None} onChange={this.onRadioButtonChange}
            /> {this.props.intl.formatMessage({ id: 'none', defaultMessage: jimuUIMessages.none })}
          </Label>
          {' '}
          <Label style={{ cursor: 'pointer' }}>
            <Radio
              style={{ cursor: 'pointer' }} value={StreamTemp.Warm} checked={this.state.streamTemp === StreamTemp.Warm} onChange={this.onRadioButtonChange}
            /> {this.props.intl.formatMessage({ id: 'typeWarm', defaultMessage: defaultMessages.typeWarm })}
          </Label>
          {' '}
          <Label style={{ cursor: 'pointer' }}>
            <Radio
              style={{ cursor: 'pointer' }} value={StreamTemp.Cool} checked={this.state.streamTemp === StreamTemp.Cool} onChange={this.onRadioButtonChange}
            /> {this.props.intl.formatMessage({ id: 'typeCool', defaultMessage: defaultMessages.typeCool })}
          </Label>
          {' '}
          <Label style={{ cursor: 'pointer' }}>
            <Radio
              style={{ cursor: 'pointer' }} value={StreamTemp.Cold} checked={this.state.streamTemp === StreamTemp.Cold} onChange={this.onRadioButtonChange}
            /> {this.props.intl.formatMessage({ id: 'typeCold', defaultMessage: defaultMessages.typeCold })}
          </Label>
          {' '}
          <Label style={{ cursor: 'pointer' }}>
            <Radio
              style={{ cursor: 'pointer' }} value={StreamTemp.Unknown} checked={this.state.streamTemp === StreamTemp.Unknown} onChange={this.onRadioButtonChange}
            /> {this.props.intl.formatMessage({ id: 'typeUnknown', defaultMessage: defaultMessages.typeUnknown })}
          </Label>
          <p />
        </div>
      </div>

    )
  }
}